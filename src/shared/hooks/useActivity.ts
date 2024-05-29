import { activitySelectors } from "@/src/modules/thread-detail/zustand/activitySlice";
import { useAppStore } from "../infra/zustand";
import { authSelectors } from "../infra/zustand/slices/authSlice";
import { useEffect, useMemo, useState } from "react";
import { formatNumber } from "../utils/numbers/formatNumber";
import { getListRepostedsByThread } from "../services/repost.service";
import { GetThreadResponse } from "../services/thread.service";

export const useActivity = () => {
  const isOpen = useAppStore(activitySelectors.isOpenActivity);
  const setOpen = useAppStore(activitySelectors.setOpenActivity);
  const thread = useAppStore(activitySelectors.activityThread);
  const setThread = useAppStore(activitySelectors.setActivityThread);
  const [quotes, setQuotes] = useState<any[]>([]);

  const user = useAppStore(authSelectors.user);

  const handleClose = () => {
    setOpen(false);
    setThread(null);
  };

  useEffect(() => {
    const fetchQuotes = async () => {
      if (thread?.id) {
        const quotes = await getListRepostedsByThread(thread?.id);
        setQuotes(quotes);
      }
    };
    fetchQuotes();
  }, [thread]);

  const likes = useMemo(
    () => formatNumber(thread?.likedByUserIds.length ?? 0),
    [thread]
  );

  const requotes = useMemo(
    () => formatNumber(thread?.reposted.length ?? 0),
    [thread]
  );

  const views = useMemo(() => formatNumber(thread?.views ?? 0), [thread]);

  return { handleClose, isOpen, likes, quotes: quotes.length, requotes, views };
};
