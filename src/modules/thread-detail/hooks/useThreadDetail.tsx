import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import {
  GetThreadResponse,
  getThreadByIdService,
} from "@/src/shared/services/thread.service";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";

interface UseThreadDetailProps {
  postId: string;
}

export const useThreadDetail = ({ postId }: UseThreadDetailProps) => {
  const [data, setData] = useState<GetThreadResponse | null>(null);
  const [ancestor, setAncestors] = useState<GetThreadResponse[]>([]);

  const user = useAppStore(authSelectors.user);

  useEffect(() => {
    const fetchThread = async () => {
      const res = await getThreadByIdService(postId, user?.id as string);
      if (res) {
        setData(res);
      } else {
        setData(null);
      }
    };
    fetchThread();
  }, [postId, user]);

  const fetchAncestors = async (parentId: string) => {
    const res = await getThreadByIdService(parentId, user?.id as string);

    if (res && res?.parent) {
      const parent = res.parent;
      await fetchAncestors(parent.id);
      setAncestors((ancestor) => [...ancestor, res]);
    } else if (res && !res?.parent) {
      setAncestors((ancestor) => [...ancestor, res]);
    } else {
      return;
    }
  };

  useEffect(() => {
    if (data && data.parentId) {
      fetchAncestors(data.parentId);
    } else {
      setAncestors([]);
    }
  }, [data?.parentId]);

  return {
    ancestor,
    data,
  };
};
