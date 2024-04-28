"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "../infra/prisma";
import { PollArg } from "./polls.service";

export type CreateThreadArg = {
  content?: CreateContentArg;
};

export type CreateContentArg = {
  text: string;
  contentType: string;
  files: FileArg[];
  tags: TagArg[];
  gif?: string;
  poll?: PollArg;
};

export type FileArg = {
  url: string;
  type: string;
};

export type TagArg = {
  title: string;
};

export const createThreadService = async (
  threadArg: CreateThreadArg[],
  authorId: string,
  parentId?: string
): Promise<any> => {
  if (threadArg.length === 0) {
    return;
  }
  const thread = threadArg[0];
  const { content } = thread;
  const result = await prisma.threads.create({
    data: {
      authorId: authorId,
      ...(parentId ? { parentId } : {}),
      ...(content
        ? {
            content: {
              create: {
                text: content.text,
                contentType: content.contentType,
                ...(content.gif ? { gif: content.gif } : {}),
                ...(content.files
                  ? {
                      files: {
                        createMany: {
                          data: content.files,
                        },
                      },
                    }
                  : {}),
                ...(content.tags
                  ? {
                      tags: {
                        connectOrCreate: content.tags.map((tag) => {
                          return {
                            where: {
                              title: tag.title,
                            },
                            create: {
                              title: tag.title,
                            },
                          };
                        }),
                      },
                    }
                  : {}),
                ...(content.poll
                  ? {
                      poll: {
                        create: {
                          options: {
                            createMany: {
                              data: content.poll.options.map((option) => {
                                return {
                                  text: option.text,
                                };
                              }),
                            },
                          },
                        },
                      },
                    }
                  : {}),
              },
            },
          }
        : {}),
    },
  });

  const id = result.id;

  await createThreadService(threadArg.slice(1), authorId, id);
};
export type GetThreadResponse = Prisma.threadsGetPayload<{
  include: {
    author: true;
    parent: true;
    content: {
      include: {
        files: true;
        tags: true;
        poll: {
          include: {
            options: true;
          };
        };
      };
    };

    child: {
      include: {
        author: true;
        content: {
          include: {
            files: true;
            tags: true;
            poll: {
              include: {
                options: true;
              };
            };
          };
        };
        _count: {
          select: {
            child: true;
          };
        };
      };
    };
    _count: {
      select: {
        child: true;
        likedByUsers: true;
      };
    };
  };
}>;

export const getThreadsService = async (
  userId?: string
): Promise<GetThreadResponse[]> => {
  const result = await prisma.threads.findMany({
    where: {
      parent: null,
      ...(userId
        ? {
            likedByUserIds: {
              has: userId,
            },
          }
        : {}),
    },
    include: {
      author: true,
      parent: true,
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
          likedByUsers: true,
        },
      },
      child: {
        take: 3,
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
        distinct: ["authorId"],
      },
    },
  });
  return result;
};

export const getThreadByIdService = async (
  id: string
): Promise<GetThreadResponse | null> => {
  const result = await prisma.threads.findFirst({
    where: {
      id,
    },
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
          likedByUsers: true,
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
  });
  return result;
};

export type GetReplyThreadResponse = Prisma.threadsGetPayload<{
  include: {
    content: true;
    author: true;
  };
}>;

export const getThreadService = async (
  id: string
): Promise<GetReplyThreadResponse | null> => {
  const result = await prisma.threads.findUnique({
    where: {
      id,
    },
    include: {
      content: true,
      author: true,
    },
  });

  return result;
};

async function fetchAllChildThreads(threadId: string): Promise<
  Prisma.threadsGetPayload<{
    include: { content: true };
  }>[]
> {
  const childThreads: Prisma.threadsGetPayload<{
    include: { content: true };
  }>[] = await prisma.threads.findMany({
    where: {
      parentId: threadId,
    },
    include: {
      content: true,
    },
  });

  const descendantThreads: Prisma.threadsGetPayload<{
    include: { content: true };
  }>[] = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread.id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export const deleteThreadService = async (threadId: string) => {
  const mainThread = (await prisma.threads.findFirst({
    where: {
      id: threadId,
    },
    include: {
      content: true,
    },
  })) as Prisma.threadsGetPayload<{
    include: { content: true };
  }>;
  const descendantThreads = await fetchAllChildThreads(threadId);

  const descendantThreadIds = [
    threadId,
    ...descendantThreads.map((thread) => thread.id),
  ];

  const descendantContentIds = [mainThread, ...descendantThreads].map(
    (thread) => thread.content?.id
  );

  for (const contentId of descendantContentIds) {
    const poll = await prisma.polls.findFirst({
      where: {
        contentId: contentId,
      },
    });
    const options = await prisma.options.findMany({
      where: {
        pollId: poll?.id as string,
      },
    });

    const optionIds = options.map((option) => option.id);

    const votedUsers = await prisma.users.findMany({
      where: {
        votedOptionIds: {
          hasSome: optionIds,
        },
      },
    });

    for (const user of votedUsers) {
      const { votedOptionIds } = user;
      await prisma.users.update({
        where: {
          id: user.id,
        },
        data: {
          votedOptionIds: votedOptionIds.filter(
            (id) => !optionIds.includes(id)
          ),
        },
      });
    }
  }

  for (const threadId of descendantThreadIds) {
    const likedUsers = await prisma.users.findMany({
      where: {
        likedThreadIds: {
          has: threadId,
        },
      },
    });

    for (const user of likedUsers) {
      const { likedThreadIds } = user;
      await prisma.users.update({
        where: {
          id: user.id,
        },
        data: {
          likedThreadIds: likedThreadIds.filter((id) => id !== threadId),
        },
      });
    }
  }

  await prisma.threads.updateMany({
    where: {
      id: {
        in: descendantThreadIds,
      },
    },
    data: {
      parentId: null,
    },
  });

  await prisma.threads.deleteMany({
    where: {
      id: {
        in: descendantThreadIds,
      },
    },
  });
  return true;
};
