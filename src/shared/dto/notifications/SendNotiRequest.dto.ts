export type notificationType =
  | "follow"
  | "like"
  | "reply"
  | "mention"
  | "repost"
  | "quote";

export type NotificationContentDTO = {
  threadId?: string;
  content?: string;
};

export type NotificationDTO = {
  senderId: string;
  notificationType: notificationType;
  title: string;
  notificationContent?: NotificationContentDTO;
  url?: string;
};

export type SendNotiRequestDTO = {
  userIds: string[];
  notification: NotificationDTO;
};

export type DeleteNotiRequestDTO = {
  type: notificationType;
  senderId: string;
  recieverId?: string;
  threadId?: string;
};
