"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "../infra/prisma";

export type CreateTagArg = {
  title: string;
};

export const createTagService = async (arg: CreateTagArg) => {
  const { title } = arg;
  await prisma.tags.create({
    data: {
      title,
    },
  });
};

export type GetTagsResponse = Prisma.tagsGetPayload<{}>;

export const getTagsService = async (
  search: string
): Promise<GetTagsResponse[]> => {
  return await prisma.tags.findMany({
    where: {
      title: {
        startsWith: search,
        mode: "insensitive",
      },
    },
  });
};

export const getUsedTagsService = async (
  userId: string
): Promise<GetTagsResponse[]> => {
  return await prisma.tags.findMany({
    where: {
      userIds: {
        has: userId,
      },
    },
  });
};

export const addTags = async (userId: string, tags: string[]) => {
  await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      usedTags: {
        connectOrCreate: tags.map((tag) => ({
          where: {
            title: tag,
          },
          create: {
            title: tag,
          },
        })),
      },
    },
  });
};
