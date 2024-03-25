import { useState } from "react";
import { Popover } from "antd";
import { AlignRight } from "lucide-react";
import { More } from "./Popover/More";
import { Apperance } from "./Popover/Apperance";

export const MoreButton = () => {
  const [openApperance, setOpenApperance] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="text-primary grow flex items-center justify-end cursor-pointer">
      <Popover
        content={
          openApperance ? (
            <Apperance onSetApperance={() => setOpenApperance(false)} />
          ) : (
            <More onSetApperance={() => setOpenApperance(true)} />
          )
        }
        placement="bottomRight"
        trigger="click"
        arrow={false}
        open={open}
        onOpenChange={(visible: boolean) => {
          setOpen(visible);
          setOpenApperance(false);
        }}
      >
        <AlignRight size={28} strokeWidth={2} />
      </Popover>
    </div>
  );
};
