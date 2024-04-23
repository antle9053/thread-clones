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
      };
    };
  };
}>;

export const getThreadsService = async (): Promise<GetThreadResponse[]> => {
  const result = await prisma.threads.findMany({
    where: {
      parent: null,
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
      _count: {
        select: {
          child: true,
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
      _count: {
        select: {
          child: true,
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
