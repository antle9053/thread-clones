"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "../infra/prisma";
import { PollArg } from "./polls.service";
import { pageType } from "@/src/modules/home";
import { deleteNotificationService } from "./notification.service";

export type CreateThreadArg = {
  content?: CreateContentArg;
  quoteId?: string;
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
  const { content, quoteId } = thread;
  const result = await prisma.threads.create({
    data: {
      authorId: authorId,
      ...(quoteId ? { quotedThreadId: quoteId } : {}),
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
    reposted: {
      include: {
        user: true;
      };
    };
    likes: {
      include: {
        user: true;
      };
    };
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
        likes: true;
      };
    };
  };
}>;

export const getThreadsService = async ({
  authorId,
  userId,
  type,
}: {
  authorId?: string;
  userId: string;
  type?: pageType;
}): Promise<GetThreadResponse[]> => {
  const result = await prisma.threads.findMany({
    where: {
      parent: null,
      ...(authorId
        ? {
            authorId,
          }
        : {}),
      ...(type === "liked"
        ? {
            likes: {
              some: {
                userId,
              },
            },
          }
        : type === "saved"
        ? {
            savedByUserIds: {
              has: userId,
            },
          }
        : type === "reposts"
        ? {
            reposted: {
              some: {
                userId,
              },
            },
          }
        : {}),
    },
    include: {
      author: true,
      parent: true,
      reposted: {
        where: {
          userId,
        },
        include: {
          user: true,
        },
      },
      likes: {
        where: {
          userId,
        },
        include: {
          user: true,
        },
      },
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
          likes: true,
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
  id: string,
  userId: string
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
      reposted: {
        where: {
          userId,
        },
        include: {
          user: true,
        },
      },
      likes: {
        where: {
          userId,
        },
        include: {
          user: true,
        },
      },
      _count: {
        select: {
          child: true,
          likes: true,
        },
      },
      child: {
        include: {
          author: true,
          likes: true,
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
    await prisma.likes.deleteMany({
      where: {
        threadId,
      },
    });
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

  await deleteNotificationService({
    type: "mention",
    senderId: mainThread.authorId,
  });
  return true;
};

export const getRepliesThread = async (
  userId: string
): Promise<GetThreadResponse[]> => {
  const user = await prisma.users.findFirst({
    where: {
      userId,
    },
  });
  const threads = await prisma.threads.findMany({
    where: {
      authorId: userId,
      NOT: {
        parentId: null,
      },
    },
  });
  const result = await prisma.threads.findMany({
    where: {
      id: {
        in: threads.map((thread) => thread.parentId as string),
      },
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
      reposted: {
        where: {
          userId: user?.id,
        },
        include: {
          user: true,
        },
      },
      likes: {
        where: {
          userId: user?.id,
        },
        include: {
          user: true,
        },
      },
      _count: {
        select: {
          child: true,
          likes: true,
        },
      },
      child: {
        include: {
          author: true,
          likes: true,
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

export const searchThreads = async (search: string) => {
  return await prisma.threads.findMany({
    where: {
      parent: null,
      content: {
        text: {
          contains: search,
          mode: "insensitive",
        },
      },
    },
    include: {
      author: true,
      parent: true,
      reposted: {
        include: {
          user: true,
        },
      },
      likes: {
        include: {
          user: true,
        },
      },
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
          likes: true,
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
};

export const getAuthorService = async (threadId: string) => {
  const thread = await prisma.threads.findUnique({
    where: {
      id: threadId,
    },
    select: {
      author: true,
    },
  });
  if (thread) {
    return thread.author;
  }
  return null;
};
