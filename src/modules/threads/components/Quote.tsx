"use client";

import { useAppStore } from "@/src/shared/infra/zustand";
import { threadsSelectors } from "../zustand/threadsSlice";
import moment from "moment";
import { Render } from "../../home/components/Render";
import { Media } from "../../home/components/Media";
import { Gif } from "@giphy/react-components";
import { Poll } from "../../home/components/Poll";
import { useWindowSize } from "usehooks-ts";
import { useEffect, useState } from "react";
import { fetchGif } from "@/src/shared/infra/giphy";

export const Quote = () => {
  const quote = useAppStore(threadsSelectors.quote);
  const { author, content, createdAt } = quote || {};
  const [gif, setGif] = useState<any>(null);
  const { width = 0 } = useWindowSize();
  const gifWidth = width > 600 ? 568 : width - 32;

  useEffect(() => {
    const initGif = async () => {
      if (content?.contentType === "gif" && content?.gif) {
        const data = await fetchGif(content?.gif);
        setGif(data);
      }
    };
    initGif();
  }, [content?.contentType, content?.gif]);

  if (!quote) return null;

  return (
    <div className="w-full p-3 border border-solid border-slate-200 my-2 rounded-md">
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
        </div>
      </div>
    </div>
  );
};
