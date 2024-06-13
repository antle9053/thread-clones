import { SendNotiResponseDTO } from "@/src/shared/dto/notifications/SendNotiResponse.dto";
import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import { getNotificaitonsService } from "@/src/shared/services/notification.service";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/src/shared/infra/socket.io";

export type SendNotiResponseWithFollow = SendNotiResponseDTO & {
  notification: {
    sender: {
      isFollowed: boolean;
    };
  };
};

export const useNotifications = () => {
  const [sends, setSends] = useState<SendNotiResponseWithFollow[]>([]);

  const user = useAppStore(authSelectors.user);
  const initialized = useRef(false);

  useEffect(() => {
    socket.on("followed", (data) => {
      const newNoti = {
        sendAt: new Date(),
        notification: {
          sender: data.following,
          title: "Followed you",
          notificationType: "follow",
        },
      } as SendNotiResponseWithFollow;
      setSends((sends) => [newNoti, ...sends]);
    });

    socket.on("liked", (data) => {
      const newNoti = {
        sendAt: new Date(),
        notification: {
          sender: data.liker,
          title: `Liked your thread`,
          notificationType: "like",
        },
      } as SendNotiResponseWithFollow;
      setSends((sends) => [newNoti, ...sends]);
    });
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await getNotificaitonsService(user?.id!);
      setSends(
        [...response].map((send) => {
          const isFollowed = send.notification.sender.followedByIDs.includes(
            user?.id!
          );
          return {
            ...send,
            notification: {
              ...send.notification,
              sender: {
                ...send.notification.sender,
                isFollowed,
              },
            },
          };
        })
      );
    };
    fetchNotifications();
  }, [user?.id]);
  return {
    sends,
  };
};
