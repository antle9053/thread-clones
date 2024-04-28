"use server";

import { prisma } from "../infra/prisma";

export const likeThreadService = async (threadId: string, userId: string) => {
  await prisma.threads.update({
    where: {
      id: threadId,
    },
    data: {
      likedByUsers: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

export const unlikeThreadService = async (threadId: string, userId: string) => {
  await prisma.threads.update({
    where: {
      id: threadId,
    },
    data: {
      likedByUsers: {
        disconnect: {
          id: userId,
        },
      },
    },
  });
};

export const isLikedService = async (
  threadId: string,
  userId: string
): Promise<boolean> => {
  const thread = await prisma.threads.findFirst({
    where: {
      id: threadId,
      likedByUserIds: {
        has: userId,
      },
    },
  });
  if (thread) return true;
  return false;
};
