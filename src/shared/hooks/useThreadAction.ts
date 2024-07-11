import { threadActionSelectors } from "@/src/modules/home/zustand/threadActionSlice";
import { useAppStore } from "../infra/zustand";
import { useCallback, useEffect, useMemo, useState } from "react";
import { authSelectors } from "../infra/zustand/slices/authSlice";
import { deleteThreadService } from "../services/thread.service";
import { message } from "antd";
import {
  isSavedService,
  saveThreadService,
  unsaveThreadService,
} from "../services/save.service";
import {
  unmentionEvent,
  unquoteEvent,
} from "@/src/shared/infra/socket.io/events";
import { useHandlePin } from "./useHandlePin";
import { homeSelectors } from "@/src/modules/home/zustand/homeSlice";

export const useThreadAction = () => {
  const [isSelf, setIsSelf] = useState<boolean | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);

  const isOpen = useAppStore(threadActionSelectors.isOpenThreadAction);
  const setOpen = useAppStore(threadActionSelectors.setOpenThreadAction);
  const thread = useAppStore(threadActionSelectors.thread);

  const pinThread = useAppStore(homeSelectors.pinThread);
  const unpinThread = useAppStore(homeSelectors.unpinThread);

  const user = useAppStore(authSelectors.user);

  useEffect(() => {
    if (thread && user?.id) {
      setIsSelf(thread?.author.id === user?.id);
    }
  }, [thread, user?.id]);

  const { handleUnpin, handlePin } = useHandlePin();

  const handleDelete = useCallback(async () => {
    if (thread && thread?.id) {
      message.open({
        key: "message-loading",
        type: "loading",
        content: "Deleting...",
        duration: 0,
      });
      unmentionEvent({
        mentionerId: user?.id!,
        threadId: thread.id,
        mentionedUsernames: [],
      });
      unquoteEvent({
        quoterId: user?.id!,
        threadId: thread.id,
      });
      await deleteThreadService(thread.id);

      setOpen(false);
      message.destroy("message-loading");
      await message.success("Deleted");
    }
  }, [thread]);

  const handleSave = useCallback(async () => {
    if (thread?.id && user?.id) {
      message.open({
        key: "message-saved-loading",
        type: "loading",
        content: "Saving...",
        duration: 0,
      });
      await saveThreadService(thread?.id, user?.id);
      setOpen(false);
      message.destroy("message-saved-loading");
      setIsSaved(true);
      await message.success("Saved");
    }
  }, [thread, user]);

  const handleUnsave = useCallback(async () => {
    if (thread?.id && user?.id) {
      message.open({
        key: "message-saved-loading",
        type: "loading",
        content: "Unsaving...",
        duration: 0,
      });
      await unsaveThreadService(thread?.id, user?.id);
      setOpen(false);
      message.destroy("message-saved-loading");
      setIsSaved(false);
      await message.success("Unsaved");
    }
  }, [thread, user]);

  const fetchSaved = useCallback(
    async (threadId?: string) => {
      if (threadId && user?.id) {
        const res = await isSavedService(threadId, user?.id);
        return res;
      }
    },
    [thread, user]
  );

  useEffect(() => {
    fetchSaved(thread?.id);
  }, [thread]);

  const isPinned = useMemo(() => thread?.pinned, [thread]);

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

  const pin = useCallback(async () => {
    if (thread) {
      pinThread(thread.id);
      await handlePin(thread.id);
    }
  }, [thread]);

  const unpin = useCallback(async () => {
    if (thread) {
      unpinThread();
      await handleUnpin(thread.id);
    }
  }, [thread]);

  return {
    isOpen,
    isPinned,
    isSelf,
    isSaved,
    handleClose,
    handleOpenConfirmDelete,
    handleCloseConfirmDelete,
    handleDelete,
    handlePin: pin,
    handleSave,
    handleUnpin: unpin,
    handleUnsave,
    openConfirmDelete,
  };
};
