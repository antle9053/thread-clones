import { Button } from "antd";
import { FC } from "react";
import { useRouter } from "next/navigation";
import {
  AtSign,
  Heart,
  MessageCircle,
  Quote,
  Repeat,
  User,
} from "lucide-react";
import { NotiResponseDTO } from "@/src/shared/dto/notifications/SendNotiResponse.dto";
import { formatFromNow } from "@/src/shared/utils/moment/formatFromNow";
import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import { updateReadNotification } from "@/src/shared/services/notification.service";

interface NotificationItemProps {
  notification: NotiResponseDTO & { sender: { isFollowed: boolean } };
  handleFollow: (followedId: string) => void;
  handleUnfollow: (followedId: string) => void;
  time: Date;
  userId?: string;
}

export const NotificationItem: FC<NotificationItemProps> = ({
  handleFollow,
  handleUnfollow,
  userId,
  time,
  notification,
}) => {
  const router = useRouter();
  const renderActivity = (activity: string) => {
    switch (activity) {
      case "like": {
        return (
          <div className="rounded-full flex justify-center items-center bg-[#fe0169] w-[22px] h-[22px] border-2 border-solid border-white">
            <Heart color="white" fill="white" size={10} />
          </div>
        );
      }
      case "mention": {
        return (
          <div className="rounded-full flex justify-center items-center bg-[#20C584] w-[22px] h-[22px] border-2 border-solid border-white">
            <AtSign color="white" size={10} />
          </div>
        );
      }
      case "repost": {
        return (
          <div className="rounded-full flex justify-center items-center bg-[#c329bf] w-[22px] h-[22px] border-2 border-solid border-white">
            <Repeat color="white" fill="white" size={10} />
          </div>
        );
      }
      case "quote": {
        return (
          <div className="rounded-full flex justify-center items-center bg-[#fe7900] w-[22px] h-[22px] border-2 border-solid border-white">
            <Quote color="white" fill="white" size={9} />
          </div>
        );
      }
      case "follow": {
        return (
          <div className="rounded-full flex justify-center items-center bg-[#6E3DEF] w-[22px] h-[22px] border-2 border-solid border-white">
            <User color="white" fill="white" size={9} />
          </div>
        );
      }
      case "reply": {
        return (
          <div className="rounded-full flex justify-center items-center bg-[#3AA6B9] w-[22px] h-[22px] border-2 border-solid border-white">
            <MessageCircle color="white" size={9} />
          </div>
        );
      }
      default: {
        return null;
      }
    }
  };

  const user = useAppStore(authSelectors.user);

  const generateUrl = (notification: NotiResponseDTO) => {
    const senderUserName = notification.sender.username;
    const threadId =
      notification.notificationContent?.threadId ??
      notification.notificationContent?.thread?.id;

    switch (notification.notificationType) {
      case "follow":
        return `/@${senderUserName}`;
      case "like":
        return `/@${user?.username}/post/${threadId}`;
      case "mention":
        return `/@${senderUserName}/post/${threadId}`;
      case "quote":
        return `/@${senderUserName}/post/${threadId}`;
      case "reply":
        return `/@${senderUserName}/post/${threadId}`;
      case "repost":
        return `/@${senderUserName}/post/${threadId}`;
      default:
        return "";
    }
  };

  return (
    <div
      className="flex p-4 !pb-0"
      onClick={async () => {
        await updateReadNotification(notification.id);
        router.push(generateUrl(notification));
      }}
    >
      <div className="flex-0 pr-4">
        <div className="relative h-fit w-fit">
          <img
            className="object-cover w-[36px] h-[36px] rounded-full"
            src={notification?.sender?.avatar ?? ""}
          />
          {notification.notificationType ? (
            <div className="absolute -bottom-2 -right-2">
              {renderActivity(notification.notificationType)}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex-1  border-b border-solid border-slate-300 pb-4 min-h-[36px]">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <span className="font-bold text-black">
                {notification.sender.username}
              </span>
              <span className="text-[#999999]">{formatFromNow(time)}</span>
            </div>
            <span className="font-[400] text-[#999999]">
              {notification.title}
            </span>
          </div>
          <div>
            {notification.sender.id === userId ? null : (
              <Button
                onClick={() => {
                  notification.sender.isFollowed
                    ? handleUnfollow(notification.sender.id)
                    : handleFollow(notification.sender.id);
                }}
              >
                {notification.sender.isFollowed ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
