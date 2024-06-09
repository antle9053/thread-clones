import { Button } from "antd";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { Heart, Quote, Repeat, User } from "lucide-react";
import { NotiResponseDTO } from "@/src/shared/dto/notifications/SendNotiResponse.dto";

interface NotificationItemProps {
  notification: NotiResponseDTO & { sender: { isFollowed: boolean } };
  handleFollow: (followedId: string) => void;
  handleUnfollow: (followedId: string) => void;
  userId?: string;
}

export const NotificationItem: FC<NotificationItemProps> = ({
  handleFollow,
  handleUnfollow,
  userId,
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
      default: {
        return null;
      }
    }
  };

  return (
    <div className="flex p-4 !pb-0">
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
            <span className="font-bold text-black">
              {notification.sender.username}
            </span>
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
