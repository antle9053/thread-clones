export type notificationType =
  | "follow"
  | "reply"
  | "mention"
  | "repost"
  | "quote";

export type NotificationDTO = {
  senderId: string;
  notificationType: notificationType;
  title: string;
  content?: string;
  url?: string;
};

export type SendNotiRequestDTO = {
  userId: string;
  notification: NotificationDTO;
};
