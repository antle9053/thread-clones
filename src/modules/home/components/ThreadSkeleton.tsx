import React from "react";
import { Skeleton } from "antd";

export const ThreadSkeleton = () => {
  return (
    <div className="flex gap-3 items-stretch pt-4 px-4 mb-2">
      <div className="basis-[48px] grow-0 flex flex-col">
        <Skeleton.Avatar size={48} />
      </div>
      <div className="basis-0 grow">
        <div className="w-full flex justify-between mb-2">
          <Skeleton.Input size="small" />
          <div className="flex gap-2">
            <Skeleton.Input size="small" />
          </div>
        </div>
        <div className="w-full mb-2">
          <Skeleton.Input />
        </div>
        <div className="w-full mb-2">
          <Skeleton.Image />
        </div>
      </div>
    </div>
  );
};
