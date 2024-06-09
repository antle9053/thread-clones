import { SendNotiResponseDTO } from "@/src/shared/dto/notifications/SendNotiResponse.dto";
import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import { getNotificaitonsService } from "@/src/shared/services/notification.service";
import { useEffect, useState } from "react";
import { UserWithFollow } from "../../profile/zustand/followSlice";

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
