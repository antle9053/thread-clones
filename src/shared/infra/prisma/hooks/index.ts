import { PrismaClient } from "@prisma/client";

export const xPrisma = new PrismaClient().$extends({
  model: {
    users: {
      async follow(userId: string, followedId: string) {
        await xPrisma.users.update({
          where: {
            id: userId,
          },
          data: {
            following: {
              connect: {
                id: followedId,
              },
            },
          },
        });
      },
    },
  },
});
