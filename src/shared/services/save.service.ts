"use server";

import { prisma } from "../infra/prisma";

export const saveThreadService = async (threadId: string, userId: string) => {
  console.log(threadId);
  await prisma.threads.update({
    where: {
      id: threadId,
    },
    data: {
      savedByUsers: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

export const unsaveThreadService = async (threadId: string, userId: string) => {
  await prisma.threads.update({
    where: {
      id: threadId,
    },
    data: {
      savedByUsers: {
        disconnect: {
          id: userId,
        },
      },
    },
  });
};

export const isSavedService = async (
  threadId: string,
  userId: string
): Promise<boolean> => {
  const thread = await prisma.threads.findFirst({
    where: {
      id: threadId,
      savedByUserIds: {
        has: userId,
      },
    },
  });
  if (thread) return true;
  return false;
};
