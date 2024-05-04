import { useThreadAction } from "@/src/shared/hooks/useThreadAction";
import { Drawer, List } from "antd";
import { ConfirmDeleteThread } from "../Modal/ConfirmDeleteThread";
import { useRepost } from "@/src/shared/hooks/useRepost";

export const Repost = () => {
  const { isOpen, isSelf, handleClose } = useRepost();

  return (
    <Drawer
      closable={false}
      onClose={handleClose}
      open={isOpen}
      placement="bottom"
    >
      <List className="bg-slate-100 rounded-lg">
        <List.Item className="!pl-4 font-bold">Repost</List.Item>
        <List.Item className="!pl-4 font-bold">Quotes</List.Item>
      </List>
    </Drawer>
  );
};
