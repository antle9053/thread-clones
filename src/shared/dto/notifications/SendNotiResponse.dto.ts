import { Prisma } from "@prisma/client";

export type SendNotiResponseDTO = Prisma.sendsGetPayload<{
  include: {
    notification: {
      include: {
        sender: true;
      };
    };
  };
}>;

export type NotiResponseDTO = Prisma.notificationsGetPayload<{
  include: {
    sender: true;
  };
}>;
