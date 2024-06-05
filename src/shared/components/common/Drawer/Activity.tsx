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
import { useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

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
      <Swiper allowTouchMove={false} noSwiping onSwiper={setSwiper}>
        <SwiperSlide>
          <div className="p-6">
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
                    <span className="font-bold">{action.name}</span>
                    <Button
                      className="flex items-center text-[#999999] !pr-0"
                      type="text"
                      onClick={() => {
                        action.action?.();
                        swiper.slideTo(1);
                      }}
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
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
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
            <div>
              {filterdListActivities.map((user, index) => (
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
          </div>
        </SwiperSlide>
      </Swiper>
    </Drawer>
  );
};
