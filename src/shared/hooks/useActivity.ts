import { activitySelectors } from "@/src/modules/thread-detail/zustand/activitySlice";
import { useAppStore } from "../infra/zustand";
import { authSelectors } from "../infra/zustand/slices/authSlice";
import { useEffect, useMemo, useState } from "react";
import { getActivityByThreadId } from "../services/activity.service";

export type activityType = "like" | "quote" | "repost";

export const useActivity = () => {
  const isOpen = useAppStore(activitySelectors.isOpenActivity);
  const setOpen = useAppStore(activitySelectors.setOpenActivity);
  const thread = useAppStore(activitySelectors.activityThread);
  const setThread = useAppStore(activitySelectors.setActivityThread);

  const [likes, setLikes] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [reposts, setReposts] = useState<any[]>([]);
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
        if (threadActivity) {
          setLikes(threadActivity?.likes);
          setQuotes(threadActivity?.quotedByThread);
          setReposts(threadActivity?.reposted);
          setViews(threadActivity?.views);
        }
      }
    };
    fetchActivity();
  }, [thread]);

  const listUsers = useMemo(() => {
    const userLikes = likes.map((like) => {
      const isFollowing = like.user.followedByIDs.includes(user?.id);
      return {
        profile: like.user,
        timestamp: like.likedAt,
        isFollowing,
        type: "like",
      };
    });
    const userReposts = reposts.map((repost) => {
      const isFollowing = repost.user.followedByIDs.includes(user?.id);
      return {
        profile: repost.user,
        timestamp: repost.repostedAt,
        isFollowing,
        type: "repost",
      };
    });
    const userQuotes = quotes.map((quote) => {
      const isFollowing = quote.author.followedByIDs.includes(user?.id);
      return {
        profile: quote.author,
        timestamp: quote.createdAt,
        isFollowing,
        type: "quote",
      };
    });
    return [...userLikes, ...userReposts, ...userQuotes];
  }, [likes, quotes, reposts]);

  return {
    handleClose,
    isOpen,
    likes,
    quotes,
    reposts,
    views,
    listUsers,
    userId: user?.id,
  };
};
