import { useAppStore } from "../infra/zustand";
import { useCallback, useEffect, useState } from "react";
import { authSelectors } from "../infra/zustand/slices/authSlice";
import { repostSelectors } from "@/src/modules/home/zustand/repostSlice";
import { message } from "antd";
import {
  deleteRepostThreadService,
  repostThreadService,
} from "../services/repost.service";
import { threadsSelectors } from "@/src/modules/threads/zustand/threadsSlice";
import {
  repostEvent,
  unrepostEvent,
} from "@/src/shared/infra/socket.io/events";

export const useRepost = () => {
  const [isSelf, setIsSelf] = useState<boolean | null>(null);
  const [isReposted, setIsReposted] = useState<boolean>(false);

  const isOpen = useAppStore(repostSelectors.isOpenRepost);
  const setOpen = useAppStore(repostSelectors.setOpenRepost);
  const thread = useAppStore(repostSelectors.thread);

  const user = useAppStore(authSelectors.user);

  const setOpenCreateThread = useAppStore(threadsSelectors.setOpenCreateThread);
  const setQuote = useAppStore(threadsSelectors.setQuote);

  useEffect(() => {
    if (thread && user?.id) {
      setIsSelf(thread?.author.id === user?.id);
      setIsReposted(thread?.reposted?.length > 0);
    }
  }, [thread, user?.id]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleRepost = useCallback(async () => {
    if (thread?.id && user?.id) {
      message.open({
        key: "message-repost-loading",
        type: "loading",
        content: "Reposting...",
        duration: 0,
      });
      await repostThreadService(thread?.id, user?.id);
      repostEvent({
        reposter: user,
        threadId: thread?.id,
      });
      setOpen(false);
      message.destroy("message-repost-loading");
      setIsReposted(true);
      await message.success("Reposted");
    }
  }, [thread, user]);

  const handleDeleteRepost = useCallback(async () => {
    if (thread?.id && user?.id) {
      message.open({
        key: "message-delete-repost-loading",
        type: "loading",
        content: "Saving...",
        duration: 0,
      });
      await deleteRepostThreadService(thread?.id, user?.id);
      unrepostEvent({
        reposterId: user?.id!,
        threadId: thread?.id!,
      });
      setOpen(false);
      message.destroy("message-delete-repost-loading");
      setIsReposted(false);
      await message.success("Removed");
    }
  }, [thread, user]);

  const handleSetQuote = useCallback(() => {
    if (thread) {
      setQuote(thread);
      setOpenCreateThread(true);
    }
  }, [thread]);

  return {
    isOpen,
    isReposted,
    isSelf,
    handleClose,
    handleDeleteRepost,
    handleRepost,
    handleSetQuote,
  };
};
