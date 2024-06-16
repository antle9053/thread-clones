import { socket } from "@/src/shared/infra/socket.io";
import { Likes, Unlikes } from "./events.type";

export const likeEvent = (payload: Likes) => {
  const { threadId, liker } = payload;
  if (socket.connected) {
    socket.emit("like", {
      threadId,
      liker,
    });
  }
};

export const unlikeEvent = (payload: Unlikes) => {
  const { threadId, likerId } = payload;
  if (socket.connected) {
    socket.emit("unlike", {
      threadId,
      likerId,
    });
  }
};
