"use server";

import { prisma } from "../infra/prisma";

export const increaseView = async (threadId: string) => {
  await prisma.threads.update({
    where: {
      id: threadId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });
};

export const getActivityByThreadId = async (threadId: string) => {
  return await prisma.threads.findUnique({
    where: {
      id: threadId,
    },
    select: {
      views: true,
      likes: {
        include: {
          user: true,
        },
      },
      reposted: {
        include: {
          user: true,
        },
      },
      quotedByThread: {
        include: {
          author: true,
        },
      },
    },
  });
};
