import { Prisma } from "@prisma/client";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat,
  Send,
} from "lucide-react";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { Poll } from "@/src/modules/home/components/Poll";
import { Render } from "@/src/modules/home/components/Render";
import { Media } from "@/src/modules/home/components/Media";
import { Gif } from "@giphy/react-components";
import { fetchGif } from "@/src/shared/infra/giphy";
import { useRouter } from "next/navigation";

import { useAppStore } from "@/src/shared/infra/zustand";
import { threadsSelectors } from "@/src/modules/threads/zustand/threadsSlice";
import { Like } from "../../home/components/Like";
import { UserAvatar } from "./User";
import { threadActionSelectors } from "../zustand/threadActionSlice";
import { GetThreadResponse } from "@/src/shared/services/thread.service";

interface ThreadReplyProps {
  data: GetThreadResponse | any;
  gifWidth: number;
}

export const ThreadReply: FC<ThreadReplyProps> = ({ data, gifWidth }) => {
  const {
    id,
    author,
    content,
    createdAt,
    _count: { child: numOfChilds, likedByUsers: numOfLikes },
  } = data;

  const router = useRouter();
  const [gif, setGif] = useState<any>(null);
  const [initLike, setInitLike] = useState<number>(numOfLikes);

  const setOpenCreateThread = useAppStore(threadsSelectors.setOpenCreateThread);
  const setReplyTo = useAppStore(threadsSelectors.setReplyTo);

  const setOpenThreadAction = useAppStore(
    threadActionSelectors.setOpenThreadAction
  );
  const setThread = useAppStore(threadActionSelectors.setThread);

  useEffect(() => {
    const initGif = async () => {
      if (content?.contentType === "gif" && content?.gif) {
        const data = await fetchGif(content?.gif);
        setGif(data);
      }
    };
    initGif();
  }, [content?.contentType, content?.gif]);

  return (
    <div
      className="border-b border-solid border-slate-200 p-4 !pt-0"
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/${author?.username}/post/${id}`);
      }}
    >
      <div className="flex gap-3 items-stretch mb-2">
        <div className="basis-[48px] grow-0">
          <UserAvatar user={author} />
        </div>
        <div className="basis-0 grow">
          <div className="w-full flex justify-between mb-2">
            <span
              className="font-bold text-base"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/@${author?.username}`);
              }}
            >
              {author?.username}
            </span>
            <div className="flex gap-2">
              <span className="text-[#666666]">
                {moment(createdAt).fromNow()}
              </span>

              <div
                className="text-black/50"
                onClick={(e) => {
                  e.stopPropagation();
                  setThread(data);
                  setOpenThreadAction(true);
                }}
              >
                <MoreHorizontal />
              </div>
            </div>
          </div>
          <div className="w-full mb-2">
            {content?.text ? <Render content={content?.text ?? ""} /> : null}
          </div>

          <div className="w-full">
            {content?.contentType === "media" ? (
              <Media files={content?.files || []} />
            ) : content?.contentType === "gif" && gif ? (
              <div className="relative w-full mb-2">
                <Gif borderRadius={12} gif={gif} width={gifWidth} noLink />
              </div>
            ) : content?.contentType === "poll" ? (
              <Poll contentId={content?.id} />
            ) : null}
          </div>

          <div className="flex h-[36px]">
            <Like threadId={id} setInitLike={setInitLike} />
            <div
              className="h-full w-[36px] flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                setReplyTo(id);
                setOpenCreateThread(true);
              }}
            >
              <MessageCircle />
            </div>
            <div className="h-full w-[36px] flex items-center">
              <Repeat />
            </div>
            <div className="h-full w-[36px] flex items-center">
              <Send />
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div>
              {numOfChilds > 0 ? (
                <span className="text-[#888888] text-base">
                  {numOfChilds} {numOfChilds === 1 ? "reply" : "replies"}
                </span>
              ) : null}
              {numOfChilds > 0 && initLike > 0 ? (
                <span>&nbsp;·&nbsp;</span>
              ) : null}
              {initLike > 0 ? (
                <span className="text-[#888888] text-base">
                  {initLike} {initLike === 1 ? "like" : "likes"}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
