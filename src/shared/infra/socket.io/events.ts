import { socket } from "@/src/shared/infra/socket.io";
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

export const likeEvent = (payload: Likes) => {
  if (socket.connected) {
    socket.emit("like", payload);
  }
};

export const unlikeEvent = (payload: Unlikes) => {
  if (socket.connected) {
    socket.emit("unlike", payload);
  }
};

export const followEvent = (payload: Follows) => {
  if (socket.connected) {
    socket.emit("follow", payload);
  }
};

export const unfollowEvent = (payload: Unfollows) => {
  if (socket.connected) {
    socket.emit("unfollow", payload);
  }
};

export const mentionEvent = (payload: Mentions) => {
  if (socket.connected) {
    socket.emit("mention", payload);
  }
};

export const unmentionEvent = (payload: UnMentions) => {
  if (socket.connected) {
    socket.emit("unmention", payload);
  }
};

export const repostEvent = (payload: Reposts) => {
  if (socket.connected) {
    socket.emit("repost", payload);
  }
};

export const unrepostEvent = (payload: UnReposts) => {
  if (socket.connected) {
    socket.emit("unrepost", payload);
  }
};

export const quoteEvent = (payload: Quotes) => {
  if (socket.connected) {
    socket.emit("quote", payload);
  }
};

export const unquoteEvent = (payload: Unquotes) => {
  if (socket.connected) {
    socket.emit("unquote", payload);
  }
};

export const replyEvent = (payload: Replies) => {
  if (socket.connected) {
    socket.emit("reply", payload);
  }
};
