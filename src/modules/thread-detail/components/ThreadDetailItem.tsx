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

interface ThreadDetailItemProps {
  id: string;
  author: Prisma.usersGetPayload<{}>;
  content: Prisma.contentsGetPayload<{
    include: {
      files: true;
    };
  }> | null;
  createdAt: Date;
  gifWidth: number;
  numOfChilds: number;
}

export const ThreadDetailItem: FC<ThreadDetailItemProps> = ({
  id,
  author,
  content,
  createdAt,
  gifWidth,
  numOfChilds,
}) => {
  const router = useRouter();
  const [gif, setGif] = useState<any>(null);

  const setOpenCreateThread = useAppStore(threadsSelectors.setOpenCreateThread);
  const setReplyTo = useAppStore(threadsSelectors.setReplyTo);

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
      className="border-b border-solid border-slate-200 p-4"
      onClick={() => {
        router.push(`/${author?.username}/post/${id}`);
      }}
    >
      <div className="flex gap-3 items-stretch mb-2">
        <div className="basis-0 grow">
          <div className="w-full flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <img
                src={author?.avatar || ""}
                className="w-[36px] h-[36px] rounded-full"
              />
              <span className="font-bold text-base">{author?.username}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#666666]">
                {moment(createdAt).fromNow()}
              </span>
              <div className="text-black/50">
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
            <div className="h-full w-[36px] flex items-center">
              <Heart />
            </div>
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
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <div>
          {numOfChilds > 0 ? (
            <>
              <span className="text-[#888888] text-base">
                {numOfChilds} {numOfChilds === 1 ? "reply" : "replies"}
              </span>
              <span>&nbsp;·&nbsp;</span>
            </>
          ) : null}
          <span className="text-[#888888] text-base">3,256 likes</span>
        </div>
      </div>
    </div>
  );
};