"use server";

import { prisma } from "../infra/prisma";

export const likeThreadService = async (threadId: string, userId: string) => {
  await prisma.likes.create({
    data: {
      userId,
      threadId,
    },
  });
};

export const unlikeThreadService = async (threadId: string, userId: string) => {
  await prisma.likes.deleteMany({
    where: {
      userId,
      threadId,
    },
  });
};

export const isLikedService = async (threadId: string, userId: string) => {
  return !!(await prisma.likes.findFirst({
    where: {
      userId,
      threadId,
    },
  }));
};
