import { sendNotificationService } from "@/src/shared/services/notification.service";
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

        await sendNotificationService({
          userId: followedId,
          notification: {
            senderId: userId,
            title: "Followed you",
            notificationType: "follow",
          },
        });
      },
    },
  },
});
