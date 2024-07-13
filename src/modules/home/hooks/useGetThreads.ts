"use client";

import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import {
  getRepliesThread,
  getThreadsService,
} from "@/src/shared/services/thread.service";
import { message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { pageType } from "..";
import { homeSelectors } from "../zustand/homeSlice";

interface UseGetThreadsProps {
  pageType: pageType;
  profileId?: string;
}

export const useGetThreads = ({ pageType, profileId }: UseGetThreadsProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);

  const threads = useAppStore(homeSelectors.threads);
  const setThreads = useAppStore(homeSelectors.setThreads);

  const page = useAppStore(homeSelectors.page);
  const setPage = useAppStore(homeSelectors.setPage);

  const user = useAppStore(authSelectors.user);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        let result: any;
        if (user) {
          if (profileId) {
            if (pageType === "profile") {
              result = await getThreadsService({
                authorId: profileId,
                userId: user.id,
                type: "profile",
                page,
              });
            } else if (pageType === "replies") {
              result = await getRepliesThread(profileId);
            } else if (pageType === "reposts") {
              result = await getThreadsService({
                userId: user.id,
                type: pageType,
                page,
              });
            }
          } else if (pageType && user && user?.id) {
            result = await getThreadsService({
              userId: user.id,
              type: pageType,
              page,
            });
          } else {
            result = await getThreadsService({ userId: user.id, page });
          }
        }
        setThreads(result, pageType);
        setHasMore(result.length !== 0);
        setLoading(false);
      } catch (error) {
        message.error("Error");
        setLoading(false);
      }
    };
    init();
  }, [user, page]);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const setLastCheckedTime = () => {
    const currentTime = new Date().toISOString();
    localStorage.setItem("lastChecked", currentTime);
  };

  const getLastCheckedTime = () => {
    return localStorage.getItem("lastChecked") || new Date().toISOString(); // Default to epoch if not found
  };

  const threadsByType = useMemo(() => {
    // if (pageType === "profile") {
    // }
    return threads[pageType];
  }, [threads, pageType]);

  return {
    loading,
    threads: threadsByType,
    handleNextPage,
    hasMore,
    setLastCheckedTime,
    getLastCheckedTime,
  };
};
