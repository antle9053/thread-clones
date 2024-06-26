"use server";

import { MentionRequestDTO } from "../dto/mentions/MentionRequest.dto";
import { prisma } from "../infra/prisma";
import { sendNotificationService } from "./notification.service";

export const mentionService = async (mentionRequest: MentionRequestDTO) => {
  const { mentionedUsernames, mentionerId, threadId } = mentionRequest;
  const mentioned = await prisma.users.findMany({
    where: {
      username: {
        in: mentionedUsernames,
      },
    },
  });

  await sendNotificationService({
    userIds: mentioned.map((mention) => mention.id),
    notification: {
      senderId: mentionerId,
      title: "Mentioned you",
      notificationContent: {
        threadId,
      },
      notificationType: "mention",
    },
  });
};
