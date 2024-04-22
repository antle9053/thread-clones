"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "../infra/prisma";

export type PollArg = {
  contentId: string;
  options: OptionArg[];
};

export type OptionArg = {
  text: string;
};

export type VoteArg = {
  pollId: string;
  optionId: string;
  userId: string;
};

export type PollReponse = Prisma.pollsGetPayload<{
  include: {
    options: true;
  };
}>;

export const getPollByContentId = async (
  contentId: string
): Promise<PollReponse | null> => {
  return await prisma.polls.findFirst({
    where: {
      contentId,
    },
    include: {
      options: true,
    },
  });
};

export const votesService = async (arg: VoteArg) => {
  const { pollId, optionId, userId } = arg;

  const options = await prisma.options.findMany({
    where: {
      pollId,
    },
  });

  await Promise.all(
    options.map(async (option) => {
      const res = await prisma.options.findFirst({
        where: {
          id: option.id,
          pollId,
        },
        select: {
          userIds: true,
        },
      });

      const userIds = res?.userIds;

      if (userIds) {
        await prisma.options.update({
          where: {
            id: option.id,
            pollId,
          },
          data: {
            userIds: userIds?.filter((id) => id !== userId),
          },
        });
      }
    })
  );

  await prisma.options.update({
    where: {
      id: optionId,
      pollId,
    },
    data: {
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });
};
