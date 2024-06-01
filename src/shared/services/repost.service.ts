"use server";

import { prisma } from "../infra/prisma";

export const repostThreadService = async (threadId: string, userId: string) => {
  await prisma.reposts.create({
    data: {
      userId,
      threadId,
    },
  });
};

export const deleteRepostThreadService = async (
  threadId: string,
  userId: string
) => {
  await prisma.reposts.deleteMany({
    where: {
      userId,
      threadId,
    },
  });
};

export const getQuotesByThread = async (threadId: string) => {
  return await prisma.threads.findMany({
    where: {
      quotedThreadId: threadId,
    },
    include: {
      author: true,
    },
  });
};

export const getListRepostedsByUser = async (userId: string) => {
  const user = await prisma.users.findUnique({
    where: { userId },
  });
  if (user)
    return await prisma.reposts.findMany({
      where: {
        userId: user.id,
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
  return [];
};

export const getListRepostedsByThread = async (threadId: string) => {
  return await prisma.reposts.findMany({
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
