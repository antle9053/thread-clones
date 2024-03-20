"use server";

import { prisma } from "@/src/shared/infra/prisma";

export const createUser = async (name: string) => {
  await prisma.user.create({ data: { name } });
};
