import {
  deleteNotificationService,
  sendNotificationService,
} from "@/src/shared/services/notification.service";
import { getAuthorService } from "@/src/shared/services/thread.service";
import { getUserService } from "@/src/shared/services/user.service";
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
          userIds: [followedId],
          notification: {
            senderId: userId,
            title: "Followed you",
            notificationType: "follow",
          },
        });
      },

      async unfollow(userId: string, followedId: string) {
        await xPrisma.users.update({
          where: {
            id: userId,
          },
          data: {
            following: {
              disconnect: {
                id: followedId,
              },
            },
          },
        });

        await deleteNotificationService({
          type: "follow",
          senderId: userId,
          recieverId: followedId,
        });
      },
    },
    likes: {
      async like(userId: string, threadId: string) {
        await xPrisma.likes.create({
          data: {
            userId,
            threadId,
          },
        });

        const author = await getAuthorService(threadId);
        const user = await getUserService(userId);
        console.log(userId);
        if (author && user) {
          await sendNotificationService({
            userIds: [author?.id],
            notification: {
              senderId: user?.id,
              title: `Liked your thread`,
              notificationType: "like",
            },
          });
        }
      },

      async unlike(userId: string, threadId: string) {
        await xPrisma.likes.deleteMany({
          where: {
            userId,
            threadId,
          },
        });
        const author = await getAuthorService(threadId);
        if (author) {
          await deleteNotificationService({
            type: "like",
            senderId: userId,
            recieverId: author?.id,
          });
        }
      },
    },
  },
});
