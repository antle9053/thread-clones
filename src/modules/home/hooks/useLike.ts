import { socket } from "@/src/shared/infra/socket.io";
import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import {
  isLikedService,
  likeThreadService,
  unlikeThreadService,
} from "@/src/shared/services/likes.service";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

interface UseLikeProps {
  threadId: string;
  setInitLike: Dispatch<SetStateAction<number>>;
}

export const useLike = ({ threadId, setInitLike }: UseLikeProps) => {
  const user = useAppStore(authSelectors.user);
  const [liked, setLiked] = useState<boolean>(false);

  const fetchLiked = useCallback(
    async (threadId: string) => {
      if (user && user?.id) {
        const res = await isLikedService(threadId, user?.id ?? "");
        setLiked(res);
      }
    },
    [threadId, user?.id]
  );

  const handleLike = useCallback(
    async (threadId: string) => {
      setInitLike((like) => like + 1);
      setLiked(true);
      if (user && user?.id) {
        await likeThreadService(threadId, user?.id ?? "");
        if (socket.connected) {
          socket.emit("like", {
            threadId,
            liker: user,
          });
        }
        await fetchLiked(threadId);
      }
    },
    [threadId, user?.id]
  );

  const handleUnlike = useCallback(
    async (threadId: string) => {
      setInitLike((like) => like - 1);
      setLiked(false);
      if (user && user?.id) {
        await unlikeThreadService(threadId, user?.id ?? "");
        await fetchLiked(threadId);
      }
    },
    [threadId, user?.id]
  );

  const handleHeartClick = useCallback(() => {}, [threadId, user?.id]);

  useEffect(() => {
    fetchLiked(threadId);
  }, [threadId]);

  return {
    handleLike,
    handleUnlike,
    liked,
  };
};
