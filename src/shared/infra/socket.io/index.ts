"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

const checkServer = async (url: string): Promise<boolean> => {
  try {
    const response = await axios.get(url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

interface SocketOptions {
  path?: string;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  timeout?: number;
}

export const createSocketConnection = async (
  url: string = "http://localhost:5000",
  options?: SocketOptions,
  connectionTimeout = 5000
): Promise<Socket | null> => {
  const serverAvailable = await checkServer(url);

  if (!serverAvailable) {
    console.warn("Server is not available.");
    return null;
  }

  const newSocket: Socket = io(url, options);

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (newSocket.connected) {
        resolve(newSocket);
      } else {
        newSocket.disconnect();
        reject(new Error("Connection attempt timed out."));
      }
    }, connectionTimeout);

    newSocket.on("connect", () => {
      clearTimeout(timer);
      resolve(newSocket);
    });

    newSocket.on("connect_error", (error) => {
      clearTimeout(timer);
      newSocket.disconnect();
      reject(error);
    });
  });
};
