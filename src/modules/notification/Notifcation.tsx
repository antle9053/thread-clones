"use client";

import { socket } from "@/src/shared/infra/socket.io";
import { useEffect, useState } from "react";

export const Notification = () => {
  const [noti, setNoti] = useState<string[]>([]);

  useEffect(() => {
    socket.on("followed", (data) => {
      setNoti((noti) => [...noti, data.followingName]);
    });
  }, []);

  return (
    <div>
      {noti.map((item, index) => {
        return <p key={index}>{item}</p>;
      })}
    </div>
  );
};
