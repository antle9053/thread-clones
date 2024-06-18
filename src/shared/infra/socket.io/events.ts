import { socket } from "@/src/shared/infra/socket.io";
import { Follows, Likes, Unfollows, Unlikes } from "./events.type";

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
