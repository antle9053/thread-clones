"use client";

import {
  GetThreadResponse,
  getThreadsService,
} from "@/src/shared/services/thread.service";
import { Prisma } from "@prisma/client";
import { message } from "antd";
import { useEffect, useState } from "react";

export const useGetThreads = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [threads, setThreads] = useState<GetThreadResponse[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const result = await getThreadsService();
        setThreads(result);
        setLoading(false);
      } catch (error) {
        message.error("Error");
        setLoading(false);
      }
    };
    init();
  }, []);

  return {
    loading,
    threads,
  };
};
