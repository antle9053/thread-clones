"use server";

import { prisma } from "../infra/prisma";
import { Prisma } from "@prisma/client";
import { xPrisma } from "../infra/prisma/hooks";

export const followUserService = async (userId: string, followedId: string) => {
  await xPrisma.users.follow(userId, followedId);
};

export const unfollowUserService = async (
  userId: string,
  followedId: string
) => {
  await xPrisma.users.unfollow(userId, followedId);
};

export const isFollowedService = async (
  followingUserId: string,
  followedUserId: string
): Promise<boolean> => {
  const user = await prisma.users.findFirst({
    where: {
      id: followingUserId,
      followingIDs: {
        has: followedUserId,
      },
    },
  });

  if (user) return true;
  return false;
};

export type User = Prisma.usersGetPayload<{}>;

export const listFollowingsService = async (
  profileId: string
): Promise<User[]> => {
  return await prisma.users.findMany({
    where: {
      followedByIDs: {
        has: profileId,
      },
    },
  });
};

export const listFollowedsService = async (
  profileId: string
): Promise<User[]> => {
  return await prisma.users.findMany({
    where: {
      followingIDs: {
        has: profileId,
      },
    },
  });
};
