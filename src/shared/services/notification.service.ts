"use server";

import {
  DeleteNotiRequestDTO,
  SendNotiRequestDTO,
} from "../dto/notifications/SendNotiRequest.dto";
import { prisma } from "../infra/prisma";

export const sendNotificationService = async (
  sendNotiRequest: SendNotiRequestDTO
) => {
  const { userIds, notification } = sendNotiRequest;
  const { notificationContent } = notification;

  const newNotificationContent = await prisma.notificationContents.create({
    data: {
      ...(notificationContent?.threadId && {
        thread: {
          connect: {
            id: notificationContent?.threadId,
          },
        },
      }),
      content: notificationContent?.content,
    },
  });

  const newNotification = await prisma.notifications.create({
    data: {
      ...notification,
      notificationContent: {
        connect: {
          id: newNotificationContent.id,
        },
      },
      senderId: undefined,
      sender: {
        connect: {
          id: notification.senderId,
        },
      },
    },
  });
  const result = await prisma.sends.createMany({
    data: userIds.map((userId) => ({
      userId,
      notificationId: newNotification.id,
    })),
  });
  return result;
};

export const getNotificaitonsService = async (userId: string) => {
  return await prisma.sends.findMany({
    where: {
      userId,
    },
    include: {
      notification: {
        include: {
          sender: true,
          notificationContent: {
            include: {
              thread: true,
              notification: true,
            },
          },
        },
      },
    },
  });
};

export const deleteNotificationService = async (
  deleteNotiRequest: DeleteNotiRequestDTO
) => {
  const { type, senderId, recieverId, threadId } = deleteNotiRequest;
  const notification = await prisma.notifications.findFirst({
    where: {
      notificationType: type,
      senderId,
      ...(recieverId && {
        recievers: {
          some: {
            userId: recieverId,
          },
        },
      }),
      ...(threadId && {
        notificationContent: {
          threadId,
        },
      }),
    },
  });

  if (notification) {
    await prisma.sends.deleteMany({
      where: {
        notificationId: notification.id,
        ...(recieverId && {
          userId: recieverId,
        }),
      },
    });

    await prisma.notifications.delete({
      where: {
        id: notification?.id,
      },
    });
  }
};
