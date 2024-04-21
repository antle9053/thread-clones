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

export const creatPollService = async (arg: PollArg) => {
  const { contentId, options } = arg;

  await prisma.polls.create({
    data: {
      contentId,
      options: {
        create: options.map((option) => ({
          text: option.text,
        })),
      },
    },
  });
};

export type VoteArg = {
  pollId: string;
  optionId: string;
  userId: string;
};

export const votesService = async (arg: VoteArg) => {
  const { pollId, optionId, userId } = arg;
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
