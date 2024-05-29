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

export const Activity = () => {
  const { isOpen, handleClose, likes, quotes, requotes, views } = useActivity();

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
        <div className="flex items-center">
          <div className="basis-[50px]">
            <Eye />
          </div>
          <div className="flex flex-1 items-center justify-between py-2 border-b-[0.5px] border-solid border-black/15">
            <span className="font-bold">Views</span>
            <Button
              className="flex items-center text-[#999999] !pr-0"
              type="text"
            >
              {views} <ChevronRight />
            </Button>
          </div>
        </div>
        <div className="flex items-center">
          <div className="basis-[50px]">
            <Heart />
          </div>
          <div className="flex flex-1 items-center justify-between py-2 border-b-[0.5px] border-solid border-black/15">
            <span className="font-bold">Likes</span>
            <Button
              className="flex items-center text-[#999999] !pr-0"
              type="text"
            >
              {likes}
              <ChevronRight />
            </Button>
          </div>
        </div>
        <div className="flex items-center">
          <div className="basis-[50px]">
            <Repeat />
          </div>
          <div className="flex flex-1 items-center justify-between py-2 border-b-[0.5px] border-solid border-black/15">
            <span className="font-bold">Requotes</span>
            <Button
              className="flex items-center text-[#999999] !pr-0"
              type="text"
            >
              {requotes} <ChevronRight />
            </Button>
          </div>
        </div>
        <div className="flex items-center">
          <div className="basis-[50px]">
            <MessageSquareQuote />
          </div>
          <div className="flex flex-1 items-center justify-between py-2 border-b-[0.5px] border-solid border-black/15">
            <span className="font-bold">Quotes</span>
            <Button
              className="flex items-center text-[#999999] !pr-0"
              type="text"
            >
              {quotes} <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
