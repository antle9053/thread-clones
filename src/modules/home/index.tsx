"use client";

import { FC, useEffect } from "react";

import { useGetThreads } from "./hooks/useGetThreads";
import { Thread } from "./components/Thread";
import { ThreadSkeleton } from "./components/ThreadSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { checkNewPosts } from "@/src/shared/services/thread.service";
import { Button, message } from "antd";

export type pageType =
  | "home"
  | "liked"
  | "saved"
  | "profile"
  | "replies"
  | "reposts";

interface HomeProps {
  pageType: pageType;
  profileId?: string;
}

export const Home: FC<HomeProps> = ({ pageType, profileId }) => {
  const {
    handleNextPage,
    hasMore,
    loading,
    setLastCheckedTime,
    getLastCheckedTime,
    threads,
  } = useGetThreads({
    pageType,
    profileId,
  });

  const showMessageWithButton = () => {
    const key = "updatable";
    const btn = (
      <Button
        size="small"
        type="default"
        className="border border-solid border-primary text-primary"
        onClick={() => {
          window.location.reload();
          message.destroy(key);
          setLastCheckedTime();
        }}
      >
        Refresh
      </Button>
    );
    message.open({
      content: (
        <div>
          <p className="pb-1">New threads available!</p>
          {btn}
        </div>
      ),
      key,
      duration: 0, // The message will not auto-dismiss
    });
  };

  const checkForNewPosts = async () => {
    try {
      const lastChecked = getLastCheckedTime();
      const newPosts = await checkNewPosts(lastChecked); // Your API endpoint
      if (newPosts) {
        showMessageWithButton();
      }
      setLastCheckedTime();
    } catch (error) {
      console.error("Error checking for new posts:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkForNewPosts();
    }, 1000 * 60 * 15); // 15 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="mx-auto w-[600px] max-w-full min-h-full pb-[48px]"
      id="home"
      style={{
        height: "100%",
        overflow: "auto",
      }}
    >
      {loading && (threads?.length === 0 || typeof threads === "undefined") ? (
        [1, 2, 3, 4, 5].map((item) => <ThreadSkeleton key={item} />)
      ) : (
        <InfiniteScroll
          dataLength={threads?.length ?? 0}
          next={handleNextPage}
          hasMore={hasMore}
          loader={<ThreadSkeleton />}
          scrollableTarget="home"
        >
          {(threads ?? []).map((thread, index) => {
            return (
              <Thread
                key={index}
                data={thread}
                profileId={profileId}
                type={pageType}
              />
            );
          })}
        </InfiniteScroll>
      )}
    </div>
  );
};
