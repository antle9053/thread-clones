"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "../infra/prisma";

export type CreateUserArg = {
  userId: string;
  name: string;
  username?: string;
  avatar?: string;
  bio?: string;
  links?: string[];
};

export type UpdateUserArg = {
  name?: string;
  username?: string;
  avatar?: string;
  bio?: string;
};

export const createUserService = async (args: CreateUserArg): Promise<void> => {
  await prisma.users.create({ data: { ...args } });
};

export type GetUserResponse = Prisma.usersGetPayload<{}>;

export const getUserService = async (
  userId?: string,
  username?: string
): Promise<GetUserResponse | null> => {
  const user = await prisma.users.findFirst({
    where: {
      ...(userId ? { userId } : {}),
      ...(username ? { username } : {}),
    },
  });
  return user;
};

export const updateUserService = async (
  userId: string,
  data: UpdateUserArg
): Promise<void> => {
  await prisma.users.update({
    where: {
      userId,
    },
    data,
  });
};

export const deleteUserService = async (userId: string) => {};

export const getUsersService = async (
  search: string
): Promise<GetUserResponse[]> => {
  return await prisma.users.findMany({
    where: {
      OR: [
        {
          username: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
  });
};
