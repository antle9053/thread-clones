import {
  UserActivity,
  activitySelectors,
} from "@/src/modules/thread-detail/zustand/activitySlice";
import { useAppStore } from "../infra/zustand";
import { authSelectors } from "../infra/zustand/slices/authSlice";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getActivityByThreadId } from "../services/activity.service";
import {
  followUserService,
  unfollowUserService,
} from "../services/follows.service";
import { message } from "antd";
import { useHandleFollow } from "./useHandleFollow";

export type activityType = "all" | "like" | "quote" | "repost";

export const useActivity = () => {
  const isOpen = useAppStore(activitySelectors.isOpenActivity);
  const setOpen = useAppStore(activitySelectors.setOpenActivity);
  const thread = useAppStore(activitySelectors.activityThread);
  const setThread = useAppStore(activitySelectors.setActivityThread);
  const setListActivities = useAppStore(activitySelectors.setListActivities);
  const listActivities = useAppStore(activitySelectors.listActivities);
  const updateFollowInActivity = useAppStore(
    activitySelectors.updateFollowInActivity
  );

  const [type, setType] = useState<activityType>("all");
  const [views, setViews] = useState<number>(0);

  const user = useAppStore(authSelectors.user);

  const handleClose = () => {
    setOpen(false);
    setThread(null);
  };

  useEffect(() => {
    const fetchActivity = async () => {
      if (thread?.id) {
        const threadActivity = await getActivityByThreadId(thread?.id);

        if (threadActivity && user) {
          const { likes, quotedByThread, reposted, views } = threadActivity;

          const userLikes: UserActivity[] = likes.map((like) => {
            const isFollowed = like.user.followedByIDs.includes(user?.id);
            const isFollowing = like.user.followingIDs.includes(user?.id);
            return {
              profile: { ...like.user, isFollowed, isFollowing },
              timestamp: like.likedAt,
              type: "like",
            };
          });
          const userReposts: UserActivity[] = reposted.map((repost) => {
            const isFollowed = repost.user.followedByIDs.includes(user?.id);
            const isFollowing = repost.user.followingIDs.includes(user?.id);
            return {
              profile: { ...repost.user, isFollowed, isFollowing },
              timestamp: repost.repostedAt,
              type: "repost",
            };
          });
          const userQuotes: UserActivity[] = quotedByThread.map((quote) => {
            const isFollowed = quote.author.followedByIDs.includes(user?.id);
            const isFollowing = quote.author.followingIDs.includes(user?.id);
            return {
              profile: { ...quote.author, isFollowed, isFollowing },
              timestamp: quote.createdAt,
              type: "quote",
            };
          });

          const listActivities = [...userLikes, ...userReposts, ...userQuotes];
          setListActivities(listActivities);

          setViews(views);
        }
      }
    };
    fetchActivity();
  }, [thread, user]);

  const filterdListActivities = useMemo(() => {
    if (type === "all") return listActivities;
    return listActivities.filter((activity) => activity.type === type);
  }, [listActivities, type]);

  const numOfLikes = useMemo(
    () => listActivities.filter((activity) => activity.type === "like").length,
    [listActivities]
  );
  const numOfQuotes = useMemo(
    () => listActivities.filter((activity) => activity.type === "quote").length,
    [listActivities]
  );
  const numOfReposts = useMemo(
    () =>
      listActivities.filter((activity) => activity.type === "repost").length,
    [listActivities]
  );

  const { handleFollow, handleUnfollow } = useHandleFollow();

  const follow = async (followedId: string) => {
    if (user) {
      await handleFollow(followedId);
      updateFollowInActivity(followedId, true);
    }
  };

  const unfollow = async (followedId: string) => {
    if (user) {
      await handleUnfollow(followedId);
      updateFollowInActivity(followedId, true);
    }
  };

  return {
    handleClose,
    isOpen,
    views,
    listActivities,
    filterdListActivities,
    numOfLikes,
    numOfQuotes,
    numOfReposts,
    userId: user?.id,
    setType,
    type,
    thread,
    handleFollow: follow,
    handleUnfollow: unfollow,
  };
};
