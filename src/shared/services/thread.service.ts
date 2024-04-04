"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "../infra/prisma";
import { GetUserResponse } from "./user.service";

export type CreateThreadArg = {
  content?: CreateContentArg;
};

export type CreateContentArg = {
  text: string;
  contentType: string;
  files: FileArg[];
};

export type FileArg = {
  url: string;
  type: string;
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
                ...(content.files
                  ? {
                      files: {
                        createMany: {
                          data: content.files,
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
      };
    };
    child: {
      select: {
        author: {
          select: {
            avatar: true;
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
        },
      },
      _count: {
        select: {
          child: true,
        },
      },
      child: {
        take: 3,
        select: {
          author: {
            select: {
              avatar: true,
            },
          },
        },
        distinct: ["authorId"],
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
