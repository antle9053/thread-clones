"use client";

import { FC, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useWindowSize } from "usehooks-ts";
import { ThreadDetailItem } from "./components/ThreadDetailItem";
import { useThreadDetail } from "./hooks/useThreadDetail";
import { MoreHorizontal } from "lucide-react";
import moment from "moment";
import { Render } from "../home/components/Render";
import { Media } from "@/src/modules/home/components/Media";
import { Gif } from "@giphy/react-components";
import { Poll } from "@/src/modules/home/components/Poll";
import { fetchGif } from "@/src/shared/infra/giphy";

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

  if (!data) return <></>;

  const {
    id,
    author,
    content,
    createdAt,
    child,
    likedByUserIds,
    _count: { child: numOfChilds },
  } = data;

  return (
    <div className="mx-auto w-[600px] max-w-full min-h-full pb-[48px]">
      {ancestor.length > 0 ? (
        <div className="w-full px-4 bg-white">
          {ancestor.map((item, index) => (
            <div key={index} className="flex gap-3 items-stretch">
              <div className="basis-[36px] grow-0 flex flex-col">
                <img
                  src={item.author?.avatar || ""}
                  className="w-[36px] h-[36px] rounded-full"
                />
                <div className="grow flex justify-center my-2">
                  <div className="w-[1px] bg-slate-300 h-full min-h-[10px]"></div>
                </div>
              </div>
              <div className="basis-0 grow">
                <div className="w-full flex justify-between">
                  <span className="font-bold text-base">
                    {item.author?.username}
                  </span>
                  <div className="flex gap-2">
                    <span className="text-[#666666]">
                      {moment(item.createdAt).fromNow()}
                    </span>
                    <div className="text-black/50">
                      <MoreHorizontal />
                    </div>
                  </div>
                </div>
                <div className="w-full mb-1">
                  <Render content={item.content?.text ?? ""} />
                </div>
                <div className="w-full">
                  {item.content?.contentType === "media" ? (
                    <Media files={item.content?.files || []} />
                  ) : item.content?.contentType === "gif" ? (
                    <div className="relative w-full mb-2">
                      {/* <Gif
                        borderRadius={12}
                        gif={gif}
                        width={gifWidth}
                        noLink
                      /> */}
                    </div>
                  ) : item.content?.contentType === "poll" ? (
                    <Poll contentId={item.content?.id} />
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div
        className="w-full bg-white border-b-[0.5px] border-solid border-black/10"
        ref={scrollToRef}
      >
        <ThreadDetailItem
          id={id}
          author={author}
          content={content}
          createdAt={createdAt}
          gifWidth={gifWidth}
          numOfChilds={numOfChilds}
          numOfLikes={likedByUserIds.length}
        />
        <div>
          {child.map((item, index) => (
            <ThreadDetailItem
              key={index}
              id={item.id}
              author={item.author}
              content={item.content}
              createdAt={item.createdAt}
              gifWidth={gifWidth}
              numOfChilds={item._count.child}
              numOfLikes={item.likedByUserIds.length}
            />
          ))}
        </div>
      </div>
      {ancestor.length > 0 ? <div className="h-screen"></div> : null}
    </div>
  );
};
