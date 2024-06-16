"use server";

import {
  DeleteNotiRequestDTO,
  SendNotiRequestDTO,
} from "../dto/notifications/SendNotiRequest.dto";
import { prisma } from "../infra/prisma";

export const sendNotificationService = async (
  sendNotiRequest: SendNotiRequestDTO
) => {
  const { userId, notification } = sendNotiRequest;
  const newNotification = await prisma.notifications.create({
    data: {
      ...notification,
      senderId: undefined,
      sender: {
        connect: {
          id: notification.senderId,
        },
      },
    },
  });
  const result = await prisma.sends.create({
    data: {
      userId,
      notificationId: newNotification.id,
    },
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
        },
      },
    },
  });
};

export const deleteNotificationService = async (
  deleteNotiRequest: DeleteNotiRequestDTO
) => {
  const { type, senderId, recieverId } = deleteNotiRequest;

  const notification = await prisma.notifications.findFirst({
    where: {
      notificationType: type,
      senderId,
      recievers: {
        some: {
          userId: recieverId,
        },
      },
    },
  });

  if (notification) {
    await prisma.sends.deleteMany({
      where: {
        notificationId: notification.id,
        userId: recieverId,
      },
    });

    if (type === "like" || type === "follow") {
      await prisma.notifications.delete({
        where: {
          id: notification?.id,
        },
      });
    }
  }
};
