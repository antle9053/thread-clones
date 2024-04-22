import { FC } from "react";
import { usePoll } from "../hooks/usePoll";
import clsx from "clsx";
import _ from "lodash";
import { Spin } from "antd";

interface PollProps {
  contentId: string;
}

export const Poll: FC<PollProps> = ({ contentId }) => {
  const {
    data,
    isPollEnd,
    handleVote,
    percentPerOption,
    votedByMe,
    voteLoading,
    votes,
  } = usePoll({
    contentId,
  });
  return (
    <div className="w-full mb-2 flex flex-col gap-2">
      {voteLoading ? (
        <div className="w-full flex justify-center py-2">
          <Spin />
        </div>
      ) : (
        (data?.options ?? []).map((option, index: number) => (
          <div
            key={index}
            className={clsx(
              "flex justify-between items-center w-full border border-solid border-slate-300 p-2 rounded-lg",
              votedByMe === option.id ? "bg-slate-200" : "bg-inherit",
              isPollEnd ? "opacity-50" : "opacity-100"
            )}
            onClick={() => {
              if (!isPollEnd) handleVote(index);
            }}
          >
            <span className="font-bold">{option.text}</span>
            <span className="font-bold">{percentPerOption[index]}%</span>
          </div>
        ))
      )}
      <div className="flex justify-between items-center">
        <span className="font-semibold">Votes: {votes}</span>
        {isPollEnd ? (
          <span className="font-semibold text-primary">Poll ended</span>
        ) : null}
      </div>
    </div>
  );
};
