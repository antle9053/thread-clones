"use server";

import { prisma } from "../infra/prisma";

export type CreateThreadArg = {
  content?: CreateContentArg;
};

export type CreateContentArg = {
  text: string;
};

export const createThreadService = async (
  threadArg: CreateThreadArg[],
  authorId: string,
  parentId?: string
): Promise<any> => {
  if (threadArg.length === 0) {
    return;
  }
  const result = await prisma.threads.create({
    data: {
      authorId: authorId,
      ...(parentId ? { parentId } : {}),
      ...(threadArg[0].content?.text
        ? {
            content: {
              create: {
                text: threadArg[0].content?.text,
              },
            },
          }
        : {}),
    },
  });

  const id = result.id;

  await createThreadService(threadArg.slice(1), authorId, id);
};
