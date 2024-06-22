"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "../infra/prisma";

export type CreateUserArg = {
  userId: string;
  name: string;
  username: string;
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

export const getUserByUserIdService = async (
  userId: string
): Promise<GetUserResponse | null> => {
  const user = await prisma.users.findFirst({
    where: {
      userId,
    },
  });
  return user;
};

export const getUserService = async (
  id?: string,
  username?: string
): Promise<GetUserResponse | null> => {
  const user = await prisma.users.findFirst({
    where: {
      ...(id ? { id } : {}),
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

export const updateSocketIdService = async (
  userId: string,
  socketId: string
) => {
  await prisma.users.update({
    where: {
      userId,
    },
    data: {
      socketId,
    },
  });
};

export const removeSocketIdService = async (userId: string) => {
  await prisma.users.update({
    where: {
      userId,
    },
    data: {
      socketId: {
        unset: true,
      },
    },
  });
};
