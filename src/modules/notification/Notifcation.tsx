"use client";

import { socket } from "@/src/shared/infra/socket.io";
import { useEffect, useState } from "react";

export const Notification = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const [name, setName] = useState("");
  const [listName, setListName] = useState<string[]>([]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("recieveData", (data) => {
      const _listName = [...listName, data];
      setListName(_listName);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [listName]);

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button
        onClick={() => {
          socket.emit("foo", name);
        }}
      >
        Click
      </button>
      <ul>
        {listName.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
};
