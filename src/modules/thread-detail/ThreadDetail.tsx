"use client";

import { FC, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useWindowSize } from "usehooks-ts";
import { ThreadDetailItem } from "./components/ThreadDetailItem";
import { useThreadDetail } from "./hooks/useThreadDetail";
import { ThreadDetailParentItem } from "./components/ThreadDetailParentItem";
import { Button } from "antd";
import { ChevronRight } from "lucide-react";
import { activitySelectors } from "./zustand/activitySlice";
import { useAppStore } from "@/src/shared/infra/zustand";
import { increaseView } from "@/src/shared/services/activity.service";

interface ThreadDetailProps {}

export const ThreadDetail: FC<ThreadDetailProps> = () => {
  const params = useParams<{ username: string; postId: string }>();
  const { width = 0 } = useWindowSize();
  const scrollToRef = useRef<null | HTMLDivElement>(null);
  const gifWidth = width > 600 ? 568 : width - 32;

  const { ancestor, data } = useThreadDetail({
    postId: params.postId,
  });

  useEffect(() => {
    if (scrollToRef && scrollToRef.current) {
      scrollToRef.current.scrollIntoView();
    }
  }, [data, scrollToRef, ancestor.length]);

  useEffect(() => {
    increaseView(params.postId);
  }, [params.postId]);

  const setOpen = useAppStore(activitySelectors.setOpenActivity);
  const setThread = useAppStore(activitySelectors.setActivityThread);

  if (!data) return <></>;

  const {
    id,
    author,
    content,
    createdAt,
    child,
    quotedThreadId,
    _count: { child: numOfChilds, likes },
  } = data;

  return (
    <div className="mx-auto w-[600px] max-w-full min-h-full pb-[48px]">
      {ancestor.length > 0 ? (
        <div className="w-full bg-white">
          {ancestor.map((item, index) => (
            <ThreadDetailParentItem
              key={index}
              id={item.id}
              author={item.author}
              content={item.content}
              createdAt={item.createdAt}
              gifWidth={gifWidth}
              numOfChilds={item.child.length}
              numOfLikes={item._count.likes}
            />
          ))}
        </div>
      ) : null}

      <div
        className="w-full bg-white border-b-[0.5px] border-solid border-black/10"
        ref={scrollToRef}
      >
        <ThreadDetailItem gifWidth={gifWidth} thread={data} />
        <div className="flex justify-between h-[50px] items-center px-4">
          <span className="font-bold text-base">Replies</span>
          <Button
            className="flex items-center text-[#999999] !pr-0"
            type="text"
            onClick={() => {
              setThread(data);
              setOpen(true);
            }}
          >
            View activity
            <ChevronRight className="ml-1" size={13} color="#999999" />
          </Button>
        </div>
        <div>
          {child.map((item: any, index: number) => (
            <ThreadDetailItem key={index} gifWidth={gifWidth} thread={item} />
          ))}
        </div>
      </div>
      {ancestor.length > 0 ? <div className="h-screen"></div> : null}
    </div>
  );
};
