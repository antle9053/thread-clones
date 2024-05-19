import { useAppStore } from "../infra/zustand";
import { useCallback, useEffect, useState } from "react";
import { authSelectors } from "../infra/zustand/slices/authSlice";
import { message } from "antd";
import { followSelectors } from "@/src/modules/profile/zustand/followSlice";
import {
  followUserService,
  listFollowedsService,
  listFollowingsService,
  unfollowUserService,
} from "../services/follows.service";
import type { User } from "../services/follows.service";

export const useFollow = () => {
  const isOpen = useAppStore(followSelectors.isOpenFollow);
  const setOpen = useAppStore(followSelectors.setOpenFollow);
  const profile = useAppStore(followSelectors.profile);
  const setProfile = useAppStore(followSelectors.setProfile);

  const listFollowings = useAppStore(followSelectors.listFollowings);
  const listFolloweds = useAppStore(followSelectors.listFolloweds);
  const setListFollowings = useAppStore(followSelectors.setListFollowings);
  const setListFolloweds = useAppStore(followSelectors.setListFolloweds);

  const updateFollow = useAppStore(followSelectors.updateFollow);

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
        updateFollow(followedId, true);
        await followUserService(user?.id, followedId);
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
        updateFollow(followedId, false);
        await unfollowUserService(user?.id, followedId);
        message.destroy("message-unfollow-loading");
        await message.success("Unfollowed");
      }
    },
    [user]
  );

  useEffect(() => {
    const initFollows = async () => {
      if (profile?.id) {
        const listFollowings = await listFollowingsService(profile.id);
        const listFolloweds = await listFollowedsService(profile.id);

        setListFollowings(
          listFollowings.map((following) => {
            return {
              ...following,
              isFollowed: following.followedByIDs.includes(user?.id as string),
            };
          })
        );
        setListFolloweds(
          listFolloweds.map((followed) => {
            return {
              ...followed,
              isFollowed: followed.followedByIDs.includes(user?.id as string),
            };
          })
        );
      }
    };
    initFollows();
  }, [profile, user]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return {
    isOpen,
    handleClose,
    handleFollow,
    handleOpen,
    handleUnfollow,
    listFolloweds,
    listFollowings,
    profile,
    setProfile,
    userId: user?.id,
  };
};
