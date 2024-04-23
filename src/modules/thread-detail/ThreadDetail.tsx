"use client";
import { FC, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  GetThreadResponse,
  getThreadByIdService,
} from "@/src/shared/services/thread.service";
import { useWindowSize } from "usehooks-ts";
import { ThreadDetailItem } from "./components/ThreadDetailItem";

interface ThreadDetailProps {}

export const ThreadDetail: FC<ThreadDetailProps> = () => {
  const params = useParams<{ username: string; postId: string }>();
  console.log(params);

  const [data, setData] = useState<GetThreadResponse | null>(null);

  const { width = 0 } = useWindowSize();

  const gifWidth = width > 600 ? 568 : width - 32;

  useEffect(() => {
    const fetchThread = async () => {
      const res = await getThreadByIdService(params.postId);
      if (res) {
        setData(res);
      } else {
        setData(null);
      }
    };
    fetchThread();
  }, [params.postId]);

  if (!data) return <></>;

  const {
    id,
    author,
    content,
    createdAt,
    child,
    _count: { child: numOfChilds },
  } = data;

  return (
    <div className="mx-auto w-[600px] max-w-full min-h-full pb-[48px]">
      <div className="w-full bg-white border-b-[0.5px] border-solid border-black/10">
        <ThreadDetailItem
          id={id}
          author={author}
          content={content}
          createdAt={createdAt}
          gifWidth={gifWidth}
          numOfChilds={numOfChilds}
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};
