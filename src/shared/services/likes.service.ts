"use server";

import { prisma } from "../infra/prisma";

export const likeThreadService = async (threadId: string, userId: string) => {
  await prisma.threads.update({
    where: {
      id: threadId,
    },
    data: {
      likedByUserIds: {
        push: userId,
      },
    },
  });
};

export const unlikeThreadService = async (threadId: string, userId: string) => {
  const thread = await prisma.threads.findFirst({
    where: {
      id: threadId,
    },
  });
  if (!thread) throw Error("Cannot found thread");
  const { likedByUserIds } = thread;
  await prisma.threads.update({
    where: {
      id: threadId,
    },
    data: {
      likedByUserIds: likedByUserIds.filter((id) => id !== userId),
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
