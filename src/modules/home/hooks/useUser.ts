import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import {
  followUserService,
  isFollowedService,
  unfollowUserService,
} from "@/src/shared/services/follows.service";
import { message } from "antd";
import { useCallback, useEffect, useState } from "react";

interface UseUserProps {
  followedId: string;
}

export const useUser = ({ followedId }: UseUserProps) => {
  const [isSelf, setIsSelf] = useState<boolean | null>(null);
  const [followed, setFollowed] = useState<boolean | null>(null);
  const user = useAppStore(authSelectors.user);

  useEffect(() => {
    if (followedId && user?.id) {
      setIsSelf(followedId === user?.id);
    }
  }, [followedId, user?.id]);

  const fetchFollowed = useCallback(
    async (followedId: string) => {
      if (user && user?.id) {
        const res = await isFollowedService(user?.id, followedId);
        setFollowed(res);
      }
    },
    [followedId, user?.id]
  );

  const handleFollow = useCallback(async () => {
    if (followedId && user?.id) {
      message.open({
        key: "message-follow-loading",
        type: "loading",
        content: "Following...",
        duration: 0,
      });
      await followUserService(user?.id, followedId);
      message.destroy("message-follow-loading");
      await fetchFollowed(followedId);
      await message.success("Followed");
    }
  }, [followedId, user]);

  const handleUnfollow = useCallback(async () => {
    if (followedId && user?.id) {
      message.open({
        key: "message-unfollow-loading",
        type: "loading",
        content: "Unfollowing...",
        duration: 0,
      });
      await unfollowUserService(user?.id, followedId);
      message.destroy("message-unfollow-loading");
      await fetchFollowed(followedId);
      await message.success("Unfollowed");
    }
  }, [followedId, user]);

  useEffect(() => {
    fetchFollowed(followedId);
  }, [followedId]);

  return { followed, handleFollow, handleUnfollow, isSelf };
};
