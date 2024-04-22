import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import {
  PollReponse,
  getPollByContentId,
  votesService,
} from "@/src/shared/services/polls.service";
import { message } from "antd";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UsePollProps {
  contentId: string;
}

export const usePoll = ({ contentId }: UsePollProps) => {
  const user = useAppStore(authSelectors.user);
  const [data, setData] = useState<PollReponse>();
  const [voteLoading, setVoteLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPoll = async () => {
      const res = await getPollByContentId(contentId);
      if (res) setData(res);
    };
    fetchPoll();
  }, [contentId]);

  const votes = useMemo(() => {
    if (data) {
      const { options } = data;
      const allVotes = options.reduce((prev, current) => {
        return prev + current.userIds.length;
      }, 0);
      return allVotes;
    }
    return 0;
  }, [data]);

  const percentPerOption = useMemo(() => {
    if (data) {
      const { options } = data;
      return options.map((option) => {
        if (votes === 0) return Number(0).toFixed(2);
        return ((option.userIds.length / votes) * 100).toFixed(2);
      });
    }
    return [];
  }, [data?.options, votes]);

  const handleVote = useCallback(
    async (index: number) => {
      if (data) {
        try {
          setVoteLoading(true);
          await votesService({
            pollId: data.id,
            optionId: data.options?.[index].id,
            userId: user?.id as string,
          });

          const res = await getPollByContentId(contentId);
          if (res) setData(res);
        } catch (error) {
          message.error("error");
        } finally {
          setVoteLoading(false);
        }
      }
    },
    [data]
  );

  const votedByMe = useMemo(() => {
    const votedOption = data?.options?.find((option) =>
      option.userIds.includes(user?.id as string)
    );
    if (votedOption) return votedOption.id;
    return "";
  }, [data?.options]);

  const isPollEnd = useMemo(() => {
    if (data) {
      const { createdAt } = data;
      const endMoment = moment(createdAt).add(1, "day");
      return endMoment.isBefore(moment(new Date()));
    }
  }, [data]);

  return {
    data,
    isPollEnd,
    handleVote,
    percentPerOption,
    votedByMe,
    voteLoading,
    votes,
  };
};
