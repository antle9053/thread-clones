import { useCallback } from "react";
import { message } from "antd";
import {
  followUserService,
  unfollowUserService,
} from "../services/follows.service";
import { followEvent, unfollowEvent } from "../infra/socket.io/events";
import { useAppStore } from "../infra/zustand";
import { authSelectors } from "../infra/zustand/slices/authSlice";

export const useHandleFollow = () => {
  const user = useAppStore(authSelectors.user);

  const handleFollow = useCallback(
    async (followedId: string) => {
      if (followedId && user?.id) {
        message.open({
          key: "message-follow-loading",
          type: "loading",
          content: "Following...",
          duration: 0,
        });
        await followUserService(user?.id, followedId);
        followEvent({
          follower: user,
          followedId,
        });
        message.destroy("message-follow-loading");
        await message.success("Followed");
      }
    },
    [user]
  );

  const handleUnfollow = useCallback(
    async (followedId: string) => {
      if (followedId && user?.id) {
        message.open({
          key: "message-unfollow-loading",
          type: "loading",
          content: "Unfollowing...",
          duration: 0,
        });
        await unfollowUserService(user?.id, followedId);

        unfollowEvent({
          followerId: user.id,
          followedId,
        });

        message.destroy("message-unfollow-loading");
        await message.success("Unfollowed");
      }
    },
    [user]
  );

  return {
    handleFollow,
    handleUnfollow,
  };
};
