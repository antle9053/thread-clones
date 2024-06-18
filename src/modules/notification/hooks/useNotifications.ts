import { SendNotiResponseDTO } from "@/src/shared/dto/notifications/SendNotiResponse.dto";
import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import { getNotificaitonsService } from "@/src/shared/services/notification.service";
import { useEffect, useMemo, useState } from "react";
import { socket } from "@/src/shared/infra/socket.io";

export type SendNotiResponseWithFollow = SendNotiResponseDTO & {
  notification: {
    sender: {
      isFollowed: boolean;
    };
  };
  notiId?: string;
};

export const useNotifications = () => {
  const [sends, setSends] = useState<SendNotiResponseWithFollow[]>([]);

  const user = useAppStore(authSelectors.user);

  useEffect(() => {
    socket.on("followed", (data) => {
      const newNoti = {
        sendAt: new Date(),
        notification: {
          sender: data.following,
          title: "Followed you",
          notificationType: "follow",
        },
        notiId: data.notiId,
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
        notiId: data.notiId,
      } as SendNotiResponseWithFollow;
      setSends((sends) => [newNoti, ...sends]);
    });

    socket.on("unliked", (data) => {
      const { likerId, authorId } = data;

      setSends((sends) =>
        [...sends].filter((send) => {
          const { notification, userId } = send;

          const isDeleted =
            notification.notificationType === "like" &&
            notification.senderId === likerId &&
            userId === authorId;
          return isDeleted;
        })
      );
    });
  }, [sends]);

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

  const filteredSends = useMemo(() => {
    return [...sends].filter((send, index, self) => {
      if (!send.notiId) return true;
      return index === self.findIndex((o) => o.notiId === send.notiId);
    });
  }, [sends]);

  return {
    sends: filteredSends,
  };
};
