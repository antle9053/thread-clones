export type notificationType =
  | "follow"
  | "like"
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
  userIds: string[];
  notification: NotificationDTO;
};

export type DeleteNotiRequestDTO = {
  type: notificationType;
  senderId: string;
  recieverId: string;
};
