"use server";

import { prisma } from "../infra/prisma";
import { xPrisma } from "../infra/prisma/hooks";

export const likeThreadService = async (threadId: string, userId: string) => {
  await xPrisma.likes.like(userId, threadId);
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

export const getListLikedsByThread = async (threadId: string) => {
  return await prisma.likes.findMany({
    where: {
      threadId,
    },
    include: {
      user: true,
      thread: {
        include: {
          author: true,
          content: {
            include: {
              files: true,
              tags: true,
              poll: {
                include: {
                  options: true,
                },
              },
            },
          },
          parent: true,
          _count: {
            select: {
              child: true,
              likes: true,
            },
          },
          child: {
            include: {
              author: true,
              content: {
                include: {
                  files: true,
                  tags: true,
                  poll: {
                    include: {
                      options: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  child: true,
                },
              },
            },
          },
        },
      },
    },
  });
};
