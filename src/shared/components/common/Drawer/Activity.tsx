import { Button, Carousel, Drawer } from "antd";
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
import { FC, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import clsx from "clsx";
import { GetThreadResponse } from "@/src/shared/services/thread.service";
import moment from "moment";
import { Render } from "@/src/modules/home/components/Render";

const ThreadThumbnail: FC<{ thread: GetThreadResponse }> = ({ thread }) => {
  return (
    <div className="w-full rounded-lg border border-solid border-black/15 p-4 mt-4 mb-2">
      <div className="flex gap-2">
        <img
          className="rounded-full w-[22px] h-[22px] object-cover"
          src={thread?.author?.avatar ?? ""}
        />
        <span className="font-bold">{thread?.author?.name}</span>
        <span className="text-[#999999]">
          {moment(thread?.createdAt).fromNow()}
        </span>
      </div>
      <div className="w-full mt-2">
        {thread?.content?.text ? (
          <Render content={thread?.content?.text ?? ""} />
        ) : null}
      </div>
    </div>
  );
};

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
    filterdListActivities,
    thread,
    handleFollow,
    handleUnfollow,
  } = useActivity();

  const listAction = [
    {
      name: "Views",
      icon: <Eye />,
      value: views,
      action: null,
    },
    {
      name: "Likes",
      icon: <Heart />,
      value: numOfLikes,
      action: () => setType("like"),
    },
    {
      name: "Reposts",
      icon: <Repeat />,
      value: numOfReposts,
      action: () => setType("repost"),
    },
    {
      name: "Quotes",
      icon: <MessageSquareQuote />,
      value: numOfQuotes,
      action: () => setType("quote"),
    },
  ];

  const [swiper, setSwiper] = useState<any>(null);

  return (
    <Drawer
      id="activities-drawer"
      closable={false}
      onClose={handleClose}
      open={isOpen}
      placement="bottom"
    >
      <Swiper
        allowTouchMove={false}
        className="h-full"
        noSwiping
        onSwiper={setSwiper}
      >
        <SwiperSlide className="max-h-full overflow-scroll">
          <div className="flex justify-between items-center p-6 absolute top-0 h-[72px] w-full">
            <div className="w-[50px]" onClick={handleClose}>
              <ArrowLeft />
            </div>
            <div>
              <span className="font-bold text-base">Post activity</span>
            </div>
            <div className="w-[50px] text-right">
              <span className="text-[#999999]">Sort</span>
            </div>
          </div>
          <div className="px-6 overflow-scroll max-h-[calc(100%_-_72px)] mt-[72px]">
            <ThreadThumbnail thread={thread!} />
            <div>
              {listAction.map((action, index) => {
                if (action.value === 0 && action.name !== "Views") return null;
                return (
                  <div className="flex items-center" key={index}>
                    <div className="basis-[50px]">{action.icon}</div>
                    <div className="flex flex-1 items-center justify-between py-2 border-b-[0.5px] border-solid border-black/15">
                      <span className="font-bold">{action.name}</span>
                      <Button
                        className="flex items-center text-[#999999] !pr-0"
                        type="text"
                        onClick={() => {
                          if (action.name !== "Views") {
                            action.action?.();
                            swiper.slideTo(1);
                          }
                        }}
                      >
                        {action.value}{" "}
                        <ChevronRight
                          className={clsx(
                            action.name !== "Views" ? "visible" : "invisible"
                          )}
                        />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              {[...listActivities].map((user, index) => (
                <UserItem
                  key={index}
                  activityType={user.type}
                  handleFollow={handleFollow}
                  handleUnfollow={handleUnfollow}
                  handleClose={handleClose}
                  profile={user.profile}
                  userId={userId}
                />
              ))}
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="max-h-full overflow-scroll">
          <div className="flex justify-between items-center p-6 absolute top-0 h-[72px] w-full">
            <div
              className="w-[50px]"
              onClick={() => {
                setType("all");
                swiper.slideTo(0);
              }}
            >
              <ArrowLeft />
            </div>
            <div>
              <span className="font-bold text-base">Post activity</span>
            </div>
            <div className="w-[50px] text-right">
              <span className="text-[#999999]">Sort</span>
            </div>
          </div>
          <div className="px-6 overflow-scroll max-h-[calc(100%_-_72px)] mt-[72px]">
            <ThreadThumbnail thread={thread!} />
            <div>
              {filterdListActivities.map((user, index) => (
                <UserItem
                  key={index}
                  activityType={user.type}
                  handleFollow={handleFollow}
                  handleUnfollow={handleUnfollow}
                  handleClose={handleClose}
                  profile={user.profile}
                  userId={userId}
                />
              ))}
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </Drawer>
  );
};
