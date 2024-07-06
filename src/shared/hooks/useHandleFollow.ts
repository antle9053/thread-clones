import { useCallback } from "react";

import { message } from "antd";
import {
  followUserService,
  unfollowUserService,
  User,
} from "../services/follows.service";
import { followEvent, unfollowEvent } from "../infra/socket.io/events";

export const useHandleFollow = () => {
  const handleFollow = useCallback(async (followedId: string, user: User) => {
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
  }, []);

  const handleUnfollow = useCallback(async (followedId: string, user: User) => {
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
  }, []);

  return {
    handleFollow,
    handleUnfollow,
  };
};
