"use client";

import { socket } from "@/src/shared/infra/socket.io";
import { useEffect, useState } from "react";
import { ActivityTabs } from "./components/ActivityTabs";
import { NotificationItem } from "./components/NotificationItem";
import { useNotifications } from "./hooks/useNotifications";

export const Notification = () => {
  const [noti, setNoti] = useState<string[]>([]);

  const { sends } = useNotifications();

  useEffect(() => {
    socket.on("followed", (data) => {
      setNoti((noti) => [...noti, data.followingName]);
    });
  }, []);

  return (
    <div className="bg-white min-h-full">
      <ActivityTabs />
      <div>
        {sends.map((send, index) => {
          return (
            <NotificationItem
              key={index}
              // profile={send.user}
              handleFollow={() => {}}
              handleUnfollow={() => {}}
              notification={send.notification}
            />
          );
        })}
      </div>
    </div>
  );
};
