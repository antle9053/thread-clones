import { useAppStore } from "../infra/zustand";
import { useEffect, useState } from "react";
import { authSelectors } from "../infra/zustand/slices/authSlice";
import { repostSelectors } from "@/src/modules/home/zustand/repostSlice";

export const useRepost = () => {
  const [isSelf, setIsSelf] = useState<boolean | null>(null);

  const isOpen = useAppStore(repostSelectors.isOpenRepost);
  const setOpen = useAppStore(repostSelectors.setOpenRepost);
  const thread = useAppStore(repostSelectors.thread);

  const user = useAppStore(authSelectors.user);

  useEffect(() => {
    if (thread && user?.id) {
      setIsSelf(thread?.author.id === user?.id);
    }
  }, [thread, user?.id]);

  const handleClose = () => {
    setOpen(false);
  };

  return {
    isOpen,
    isSelf,
    handleClose,
  };
};
