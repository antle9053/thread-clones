import { List, Typography } from "antd";
import { FC, useState } from "react";
import { Apperance } from "./Apperance";

type MoreProps = {
  onSetApperance: () => void;
};

export const More: FC<MoreProps> = ({ onSetApperance }) => {
  return (
    <div>
      <div
        className="!py-2 !px-3 cursor-pointer dark:bg-[#222222] border-b border-solid border-gray-200 dark:border-gray-600"
        onClick={onSetApperance}
      >
        <span className="dark:text-white text-base font-[500]">Apperance</span>
      </div>
      <div className="!py-2 !px-3 cursor-pointer dark:bg-[#222222] border-b border-solid border-gray-200 dark:border-gray-600">
        <span className="dark:text-white text-base font-[500]">Apperance</span>
      </div>
      <div className="!py-2 !px-3 cursor-pointer dark:bg-[#222222]">
        <span className="dark:text-white text-base font-[500]">Apperance</span>
      </div>
    </div>
  );
};
