import { useAppStore } from "@/src/shared/infra/zustand";
import { Repeat } from "lucide-react";
import { FC } from "react";
import { repostSelectors } from "../zustand/repostSlice";
import { GetThreadResponse } from "@/src/shared/services/thread.service";

interface RepostProps {
  thread: GetThreadResponse;
}

export const Repost: FC<RepostProps> = ({ thread }) => {
  const setOpen = useAppStore(repostSelectors.setOpenRepost);
  const setThread = useAppStore(repostSelectors.setThread);
  return (
    <div className="h-full w-[36px] flex items-center">
      <Repeat
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
          setThread(thread);
        }}
      />
    </div>
  );
};
