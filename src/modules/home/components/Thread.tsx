import { GetThreadResponse } from "@/src/shared/services/thread.service";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat,
  Send,
} from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useAppStore } from "@/src/shared/infra/zustand";
import { threadsSelectors } from "../../threads/zustand/threadsSlice";
import { Avatar, Popover } from "antd";
import { Media } from "./Media";
import { Gif } from "@giphy/react-components";
import { useWindowSize } from "usehooks-ts";
import { fetchGif } from "@/src/shared/infra/giphy";
import { Render } from "./Render";
import { Poll } from "./Poll";
import { useRouter } from "next/navigation";
import { Like } from "./Like";
import { threadActionSelectors } from "../zustand/threadActionSlice";
import { formatFromNow } from "@/src/shared/utils/moment/formatFromNow";
import { UserAvatar } from "./User";
import { ThreadReply } from "./Reply";
import { Repost } from "./Repost";
import moment from "moment";
import { Quote } from "../../threads/components/Quote";
import { increaseView } from "@/src/shared/services/activity.service";

interface ThreadProps {
  data: GetThreadResponse;
  profileId?: string;
  type?: string;
}

export const Thread: FC<ThreadProps> = ({ data, profileId, type }) => {
  const {
    id,
    author,
    content,
    createdAt,
    child,
    reposted,
    quotedThreadId,
    _count: { child: numOfChilds, likes },
  } = data;

  const [initLike, setInitLike] = useState<number>(likes);

  const router = useRouter();

  const [gif, setGif] = useState<any>(null);

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

  const { width = 0 } = useWindowSize();

  const gifWidth = width > 600 ? 492 : width - 108;

  return (
    <div
      className="w-full bg-white border-b-[0.5px] border-solid border-black/10"
      onClick={async () => {
        router.push(`/@${author?.username}/post/${id}`);
      }}
    >
      {reposted.length > 0 && type === "reposts" ? (
        <div className="flex gap-3 items-center pt-4 px-4">
          <div className="basis-[48px] grow-0">
            <Repeat className="float-end" size={16} color="#999999" />
          </div>
          <span className="text-sm text-[#999999] block">
            {reposted[0].user.username} has reposted{" "}
            {moment(reposted[0].repostedAt).fromNow()}
          </span>
        </div>
      ) : null}
      <div className="flex gap-3 items-stretch pt-4 px-4 mb-2">
        <div className="basis-[48px] grow-0 flex flex-col">
          <UserAvatar user={author} />
          {numOfChilds > 0 ? (
            <div className="grow flex justify-center mt-2">
              <div className="w-[1px] bg-slate-300 h-full"></div>
            </div>
          ) : null}
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
              <span className="text-[#666666]">{formatFromNow(createdAt)}</span>

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
          <div className="w-full mb-2">
            {quotedThreadId ? (
              <Quote type="view" quoteId={quotedThreadId} />
            ) : null}
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
            <Repost thread={data} />
            <div className="h-full w-[36px] flex items-center">
              <Send />
            </div>
          </div>
          {type === "replies" ? (
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
          ) : null}
        </div>
      </div>
      {type !== "replies" ? (
        <div className="flex gap-3 items-center px-4 pb-4">
          <div className="basis-[48px] grow-0 flex justify-center ">
            <Avatar.Group>
              {child.map((item: any, index: number) => {
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
      ) : (
        <div>
          {child
            .filter((item: any) => {
              return item.authorId === profileId;
            })
            .map((item: any, index: number) => {
              return (
                <ThreadReply key={index} gifWidth={gifWidth} data={item} />
              );
            })}
        </div>
      )}
    </div>
  );
};
