import { createSocketConnection } from "@/src/shared/infra/socket.io";
import {
  Follows,
  Likes,
  Mentions,
  Quotes,
  Replies,
  Reposts,
  Unfollows,
  Unlikes,
  UnMentions,
  Unquotes,
  UnReposts,
} from "./events.type";

export const likeEvent = async (payload: Likes) => {
  const socket = await createSocketConnection();
  if (socket?.connected) {
    socket.emit("like", payload);
  }
};

export const unlikeEvent = async (payload: Unlikes) => {
  const socket = await createSocketConnection();
  if (socket?.connected) {
    socket.emit("unlike", payload);
  }
};

export const followEvent = async (payload: Follows) => {
  const socket = await createSocketConnection();
  if (socket?.connected) {
    socket.emit("follow", payload);
  }
};

export const unfollowEvent = async (payload: Unfollows) => {
  const socket = await createSocketConnection();
  if (socket?.connected) {
    socket.emit("unfollow", payload);
  }
};

export const mentionEvent = async (payload: Mentions) => {
  const socket = await createSocketConnection();
  if (socket?.connected) {
    socket.emit("mention", payload);
  }
};

export const unmentionEvent = async (payload: UnMentions) => {
  const socket = await createSocketConnection();
  if (socket?.connected) {
    socket.emit("unmention", payload);
  }
};

export const repostEvent = async (payload: Reposts) => {
  const socket = await createSocketConnection();
  if (socket?.connected) {
    socket.emit("repost", payload);
  }
};

export const unrepostEvent = async (payload: UnReposts) => {
  const socket = await createSocketConnection();
  if (socket?.connected) {
    socket.emit("unrepost", payload);
  }
};

export const quoteEvent = async (payload: Quotes) => {
  const socket = await createSocketConnection();
  if (socket?.connected) {
    socket.emit("quote", payload);
  }
};

export const unquoteEvent = async (payload: Unquotes) => {
  const socket = await createSocketConnection();
  if (socket?.connected) {
    socket.emit("unquote", payload);
  }
};

export const replyEvent = async (payload: Replies) => {
  const socket = await createSocketConnection();
  if (socket?.connected) {
    socket.emit("reply", payload);
  }
};
