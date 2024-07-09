import { useAppStore } from "@/src/shared/infra/zustand";
import { useCallback, useEffect, useState } from "react";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import { message } from "antd";
import { followSelectors } from "@/src/modules/profile/zustand/followSlice";
import {
  followUserService,
  listFollowedsService,
  listFollowingsService,
  unfollowUserService,
} from "@/src/shared/services/follows.service";
import { useHandleFollow } from "@/src/shared/hooks/useHandleFollow";

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

  const { handleFollow, handleUnfollow } = useHandleFollow();

  const follow = async (followedId: string) => {
    if (user) {
      updateFollow(followedId, true);
      await handleFollow(followedId);
    }
  };

  const unfollow = async (followedId: string) => {
    if (user) {
      updateFollow(followedId, false);
      await handleUnfollow(followedId);
    }
  };

  useEffect(() => {
    const initFollows = async () => {
      if (profile?.id && user) {
        const listFollowings = await listFollowingsService(profile.id);
        const listFolloweds = await listFollowedsService(profile.id);

        setListFollowings(
          listFollowings.map((following) => {
            return {
              ...following,
              isFollowed: following.followedByIDs.includes(user.id),
              isFollowing: following.followingIDs.includes(user.id),
            };
          })
        );
        setListFolloweds(
          listFolloweds.map((followed) => {
            return {
              ...followed,
              isFollowed: followed.followedByIDs.includes(user.id),
              isFollowing: followed.followingIDs.includes(user.id),
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
    handleFollow: follow,
    handleOpen,
    handleUnfollow: unfollow,
    listFolloweds,
    listFollowings,
    profile,
    setProfile,
    userId: user?.id,
  };
};
