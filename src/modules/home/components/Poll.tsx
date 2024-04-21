import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import { votesService } from "@/src/shared/services/polls.service";
import { FC } from "react";

interface PollProps {
  data: any;
}

export const Poll: FC<PollProps> = ({ data }) => {
  const { options } = data;
  const user = useAppStore(authSelectors.user);
  return (
    <div className="w-full mb-2 flex flex-col gap-2">
      {options.map((option: any, index: number) => (
        <div
          key={index}
          className="w-full border border-solid border-slate-500 p-2 rounded-lg"
          onClick={async () => {
            await votesService({
              pollId: data.id,
              optionId: option.id,
              userId: user?.id as string,
            });
          }}
        >
          <span className="font-bold">{option.text}</span>
        </div>
      ))}
    </div>
  );
};
