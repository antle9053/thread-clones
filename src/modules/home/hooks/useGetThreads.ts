"use client";

import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import {
  GetThreadResponse,
  getThreadsService,
} from "@/src/shared/services/thread.service";
import { message } from "antd";
import { useEffect, useState } from "react";
import { pageType } from "..";

interface UseGetThreadsProps {
  pageType?: pageType;
}

export const useGetThreads = ({ pageType }: UseGetThreadsProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [threads, setThreads] = useState<GetThreadResponse[]>([]);

  const user = useAppStore(authSelectors.user);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        let result: any;
        if (pageType && user && user?.id)
          result = await getThreadsService(user?.id, pageType);
        else result = await getThreadsService();
        setThreads(result);
        setLoading(false);
      } catch (error) {
        message.error("Error");
        setLoading(false);
      }
    };
    init();
  }, [user]);

  return {
    loading,
    threads,
  };
};
