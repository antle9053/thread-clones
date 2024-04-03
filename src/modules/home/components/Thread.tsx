import { GetThreadResponse } from "@/src/shared/services/thread.service";
import { GetUserResponse } from "@/src/shared/services/user.service";
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
import { CreateThread } from "../../threads/CreateThread";
import { useAppStore } from "@/src/shared/infra/zustand";
import { threadsSelectors } from "../../threads/zustand/threadsSlice";
import { Avatar } from "antd";
import { Media } from "./Media";

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
    _count: { child: numOfChilds },
  } = data;

  const setOpenCreateThread = useAppStore(threadsSelectors.setOpenCreateThread);
  const setReplyTo = useAppStore(threadsSelectors.setReplyTo);

  return (
    <div className="w-full bg-white border-b-[0.5px] border-solid border-black/10 p-4">
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
            <div>
              <span className="text-base">{content?.text}</span>
            </div>
          </div>

          <div className="w-full mb-2">
            <Media files={content?.files || []} />
          </div>

          <div className="flex h-[36px]">
            <div className="h-full w-[36px] flex items-center">
              <Heart />
            </div>
            <div
              className="h-full w-[36px] flex items-center"
              onClick={() => {
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

      <CreateThread />
    </div>
  );
};
