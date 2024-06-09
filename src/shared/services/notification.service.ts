"use server";

import { SendNotiRequestDTO } from "../dto/notifications/SendNotiRequest.dto";
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
