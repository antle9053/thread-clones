import { threadActionSelectors } from "@/src/modules/home/zustand/threadActionSlice";
import { useAppStore } from "../infra/zustand";
import { useCallback, useEffect, useState } from "react";
import { authSelectors } from "../infra/zustand/slices/authSlice";
import { deleteThreadService } from "../services/thread.service";
import { message } from "antd";

export const useThreadAction = () => {
  const [isSelf, setIsSelf] = useState<boolean | null>(null);

  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);

  const isOpen = useAppStore(threadActionSelectors.isOpenThreadAction);
  const setOpen = useAppStore(threadActionSelectors.setOpenThreadAction);
  const thread = useAppStore(threadActionSelectors.thread);

  const user = useAppStore(authSelectors.user);

  useEffect(() => {
    if (thread && user?.id) {
      setIsSelf(thread?.author.id === user?.id);
    }
  }, [thread, user?.id]);

  const handleDelete = useCallback(async () => {
    if (thread && thread?.id) {
      setLoadingDelete(true);
      message.open({
        key: "message-loading",
        type: "loading",
        content: "Deleting...",
        duration: 0,
      });
      await deleteThreadService(thread?.id);
      setOpen(false);
      setLoadingDelete(false);
      message.destroy("message-loading");
      await message.success("Deleted");
    }
  }, [thread]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenConfirmDelete = () => {
    setOpen(false);
    setOpenConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  return {
    isOpen,
    isSelf,
    handleClose,
    handleOpenConfirmDelete,
    handleCloseConfirmDelete,
    handleDelete,
    openConfirmDelete,
  };
};
