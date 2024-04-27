import { GetThreadResponse } from "@/src/shared/services/thread.service";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat,
  Send,
} from "lucide-react";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { useAppStore } from "@/src/shared/infra/zustand";
import { threadsSelectors } from "../../threads/zustand/threadsSlice";
import { Avatar } from "antd";
import { Media } from "./Media";
import { Gif } from "@giphy/react-components";
import { useWindowSize } from "usehooks-ts";
import { fetchGif } from "@/src/shared/infra/giphy";
import { Render } from "./Render";
import { Poll } from "./Poll";
import { useRouter } from "next/navigation";
import { Like } from "./Like";

interface ThreadProps {
  data: GetThreadResponse;
}

export const Thread: FC<ThreadProps> = ({ data }) => {
  const {
    id,
    author,
    content,
    createdAt,
    child,
    likedByUserIds,
    _count: { child: numOfChilds },
  } = data;

  const [initLike, setInitLike] = useState<number>(likedByUserIds.length);

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

  const { width = 0 } = useWindowSize();

  const gifWidth = width > 600 ? 492 : width - 108;

  return (
    <div
      className="w-full bg-white border-b-[0.5px] border-solid border-black/10 p-4"
      onClick={() => router.push(`/${author?.username}/post/${id}`)}
    >
      <div className="flex gap-3 items-stretch mb-2">
        <div className="basis-[48px] grow-0 flex flex-col">
          <img
            src={author?.avatar || ""}
            className="w-[48px] h-[48px] rounded-full"
          />
          {numOfChilds > 0 ? (
            <div className="grow flex justify-center mt-2">
              <div className="w-[1px] bg-slate-300 h-full"></div>
            </div>
          ) : null}
        </div>
        <div className="basis-0 grow">
          <div className="w-full flex justify-between mb-2">
            <span className="font-bold text-base">{author?.username}</span>
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
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <div className="basis-[48px] grow-0 flex justify-center ">
          <Avatar.Group>
            {child.map((item, index) => {
              return (
                <Avatar
                  key={index}
                  src={item?.author?.avatar || ""}
                  className="w-[20px] h-[20px] rounded-full"
                ></Avatar>
              );
            })}
          </Avatar.Group>
        </div>
        <div>
          {numOfChilds > 0 ? (
            <span className="text-[#888888] text-base">
              {numOfChilds} {numOfChilds === 1 ? "reply" : "replies"}
            </span>
          ) : null}
          {numOfChilds > 0 && initLike > 0 ? <span>&nbsp;·&nbsp;</span> : null}
          {initLike > 0 ? (
            <span className="text-[#888888] text-base">
              {initLike} {initLike === 1 ? "like" : "likes"}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
