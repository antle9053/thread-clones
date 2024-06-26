import { Prisma } from "@prisma/client";

export type SendNotiResponseDTO = Prisma.sendsGetPayload<{
  include: {
    notification: {
      include: {
        sender: true;
        notificationContent: {
          include: {
            thread: true;
            notification: true;
          };
        };
      };
    };
  };
}>;

export type NotiResponseDTO = Prisma.notificationsGetPayload<{
  include: {
    sender: true;
    notificationContent: {
      include: {
        thread: true;
        notification: true;
      };
    };
  };
}>;
