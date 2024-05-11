import { Drawer, List } from "antd";
import { useRepost } from "@/src/shared/hooks/useRepost";
import clsx from "clsx";
import { MessageSquareQuote, Repeat } from "lucide-react";

export const Repost = () => {
  const { isOpen, isReposted, handleClose, handleRepost, handleDeleteRepost } =
    useRepost();

  return (
    <Drawer
      closable={false}
      onClose={handleClose}
      open={isOpen}
      placement="bottom"
    >
      <List className="bg-slate-100 rounded-lg">
        <List.Item
          className="!px-4"
          onClick={() => (isReposted ? handleDeleteRepost() : handleRepost())}
        >
          <span
            className={clsx(
              "font-bold",
              isReposted ? "text-[#FF3040]" : "text-black"
            )}
          >
            {isReposted ? "Remove" : "Repost"}
          </span>
          <Repeat size={20} color={isReposted ? "#FF3040" : "black"} />
        </List.Item>
        <List.Item className="!px-4">
          <span className="font-bold">Quote</span>
          <MessageSquareQuote size={20} />
        </List.Item>
      </List>
    </Drawer>
  );
};
