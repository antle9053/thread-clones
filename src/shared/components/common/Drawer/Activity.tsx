import { Button, Drawer, List } from "antd";
import { useActivity } from "@/src/shared/hooks/useActivity";
import {
  ArrowLeft,
  ChevronRight,
  Eye,
  Heart,
  MessageSquareQuote,
  Repeat,
} from "lucide-react";
import { UserItem } from "./Follows";
import { useMemo } from "react";

export const Activity = () => {
  const {
    isOpen,
    handleClose,
    numOfLikes,
    numOfQuotes,
    numOfReposts,
    views,
    listActivities,
    userId,
    setType,
    type,
  } = useActivity();

  const listAction = [
    {
      name: "view",
      icon: <Eye />,
      value: views,
      action: null,
    },
    {
      name: "likes",
      icon: <Heart />,
      value: numOfLikes,
      action: () => setType("like"),
    },
    {
      name: "repost",
      icon: <Repeat />,
      value: numOfReposts,
      action: () => setType("repost"),
    },
    {
      name: "quote",
      icon: <MessageSquareQuote />,
      value: numOfQuotes,
      action: () => setType("quote"),
    },
  ];

  return (
    <Drawer
      closable={false}
      onClose={handleClose}
      open={isOpen}
      placement="bottom"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="w-[50px]">
          <ArrowLeft />
        </div>
        <div>
          <span className="font-bold text-base">Post activity</span>
        </div>
        <div className="w-[50px] text-right">
          <span className="text-[#999999]">Sort</span>
        </div>
      </div>
      <div>
        {listAction.map((action, index) => (
          <div className="flex items-center" key={index}>
            <div className="basis-[50px]">{action.icon}</div>
            <div className="flex flex-1 items-center justify-between py-2 border-b-[0.5px] border-solid border-black/15">
              <span className="font-bold">Views</span>
              <Button
                className="flex items-center text-[#999999] !pr-0"
                type="text"
                onClick={() => action.action?.()}
              >
                {action.value} <ChevronRight />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div>
        {listActivities.map((user, index) => (
          <UserItem
            key={index}
            activityType={user.type}
            handleFollow={() => {}}
            handleUnfollow={() => {}}
            profile={user.profile}
            userId={userId}
          />
        ))}
      </div>
    </Drawer>
  );
};
