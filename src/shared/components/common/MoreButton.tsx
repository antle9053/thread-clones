import { useState } from "react";
import { Popover } from "antd";
import { AlignRight } from "lucide-react";
import { More } from "./Popover/More";

export const MoreButton = () => {
  return (
    <div className="text-primary grow flex items-center justify-end cursor-pointer">
      <Popover
        className="!p-0"
        content={<More />}
        placement="bottomRight"
        trigger="click"
        arrow={false}
      >
        <AlignRight size={28} strokeWidth={2} />
      </Popover>
    </div>
  );
};
