import { useHandleFollow } from "@/src/shared/hooks/useHandleFollow";
import { socket } from "@/src/shared/infra/socket.io";
import {
  followEvent,
  unfollowEvent,
} from "@/src/shared/infra/socket.io/events";
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
      if (user && user?.id && followedId) {
        const res = await isFollowedService(user?.id, followedId);
        setFollowed(res);
      }
    },
    [followedId, user?.id]
  );

  const { handleFollow, handleUnfollow } = useHandleFollow();

  const follow = async () => {
    if (user) {
      await handleFollow(followedId);
      await fetchFollowed(followedId);
    }
  };

  const unfollow = async () => {
    if (user) {
      await handleUnfollow(followedId);
      await fetchFollowed(followedId);
    }
  };

  useEffect(() => {
    fetchFollowed(followedId);
  }, [followedId]);

  return { followed, handleFollow: follow, handleUnfollow: unfollow, isSelf };
};
