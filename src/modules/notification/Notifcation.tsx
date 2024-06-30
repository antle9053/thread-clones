"use client";

import { ActivityTabs } from "./components/ActivityTabs";
import { NotificationItem } from "./components/NotificationItem";
import { useNotifications } from "./hooks/useNotifications";

export const Notification = () => {
  const { sends, activeTab, setActiveTab } = useNotifications();

  return (
    <div className="bg-white min-h-full">
      <ActivityTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>
        {sends.map((send, index) => {
          return (
            <NotificationItem
              key={index}
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
