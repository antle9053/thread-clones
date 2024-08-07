import { ConfirmDeleteThread } from "@/src/shared/components/common/Modal/ConfirmDeleteThread";
import { useThreadAction } from "@/src/shared/hooks/useThreadAction";
import { Drawer, List } from "antd";

export const ThreadActionDrawer = () => {
  const {
    isOpen,
    isPinned,
    isSelf,
    isSaved,
    handleClose,
    handleCloseConfirmDelete,
    handleDelete,
    handleOpenConfirmDelete,
    handlePin,
    handleSave,
    handleUnpin,
    handleUnsave,
    openConfirmDelete,
  } = useThreadAction();

  const seflOptions = (
    <>
      <List className="bg-slate-100 rounded-lg mb-4">
        <List.Item
          className="!pl-4 font-bold"
          onClick={() => (isSaved ? handleUnsave() : handleSave())}
        >
          {isSaved ? "Unsave" : "Save"}
        </List.Item>
        <List.Item
          className="!pl-4 font-bold"
          onClick={() => (isPinned ? handleUnpin() : handlePin())}
        >
          {isPinned ? "Unpin" : "Pin to profile"}
        </List.Item>
        <List.Item className="!pl-4 font-bold">
          Hide like and share counts
        </List.Item>
        <List.Item className="!pl-4 font-bold">Who can reply</List.Item>
      </List>
      <List className="bg-slate-100 rounded-lg">
        <List.Item
          className="!pl-4 font-bold !text-[#FF3040]"
          onClick={handleOpenConfirmDelete}
        >
          Delete
        </List.Item>
      </List>
    </>
  );

  const otherOptions = (
    <>
      <List className="bg-slate-100 rounded-lg mb-4">
        <List.Item className="!pl-4 font-bold" onClick={handleSave}>
          Save
        </List.Item>
        <List.Item className="!pl-4 font-bold">Hide</List.Item>
      </List>
      <List className="bg-slate-100 rounded-lg">
        <List.Item className="!pl-4 font-bold">Mute</List.Item>
        <List.Item className="!pl-4 font-bold">Unfollow</List.Item>
        <List.Item className="!pl-4 font-bold !text-[#FF3040]">
          Report
        </List.Item>
      </List>
    </>
  );

  return (
    <>
      <Drawer
        closable={false}
        onClose={handleClose}
        open={isOpen}
        placement="bottom"
      >
        {isSelf ? seflOptions : otherOptions}
      </Drawer>
      <ConfirmDeleteThread
        open={openConfirmDelete}
        handleClose={handleCloseConfirmDelete}
        handleDelete={handleDelete}
      />
    </>
  );
};
