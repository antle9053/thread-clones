import { threadActionSelectors } from "@/src/modules/home/zustand/threadActionSlice";
import { useAppStore } from "@/src/shared/infra/zustand";
import { Drawer, List } from "antd";

export const ThreadAction = () => {
  const isOpen = useAppStore(threadActionSelectors.isOpenThreadAction);
  const setOpen = useAppStore(threadActionSelectors.setOpenThreadAction);
  const threadId = useAppStore(threadActionSelectors.threadId);
  return (
    <Drawer
      closable={false}
      onClose={() => setOpen(false)}
      open={isOpen}
      placement="bottom"
    >
      <List className="bg-slate-100 rounded-lg mb-4">
        <List.Item className="!pl-4 font-bold">Save</List.Item>
        <List.Item className="!pl-4 font-bold">Hide</List.Item>
      </List>
      <List className="bg-slate-100 rounded-lg">
        <List.Item className="!pl-4 font-bold">Mute</List.Item>
        <List.Item className="!pl-4 font-bold">Unfollow</List.Item>
        <List.Item className="!pl-4 font-bold">Report</List.Item>
      </List>
    </Drawer>
  );
};
