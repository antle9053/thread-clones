"use server";

import { prisma } from "../infra/prisma";

export type CreateUserArg = {
  userId: string;
  name: string;
  username?: string;
  avatar?: string;
  bio?: string;
  links?: string[];
};

export type GetUserResponse = {
  id: string;
  userId: string;
  username: string | null;
  name: string;
  avatar: string | null;
  bio: string | null;
  links: string[];
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

export const getUserService = async (
  userId: string
): Promise<GetUserResponse | null> => {
  const user = await prisma.users.findUnique({
    where: {
      userId,
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
