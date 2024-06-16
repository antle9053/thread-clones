"use server";
import { createServer } from "http";
import { Server } from "socket.io";
import { prisma } from "../prisma";
import { getAuthorService } from "../../services/thread.service";
import { Likes, Unlikes } from "./events.type";

const httpServer = createServer();

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  socket.on("foo", (data) => {
    socket.broadcast.emit("recieveData", data);
  });

  socket.on(
    "follow",
    async (data: { followingName: string; followedId: string }) => {
      const { followingName, followedId } = data;

      const followedUser = await prisma.users.findUnique({
        where: {
          id: followedId,
        },
      });

      const following = await prisma.users.findFirst({
        where: {
          username: followingName,
        },
      });

      if (followedUser && followedUser.socketId) {
        socket.to(followedUser.socketId).emit("followed", {
          following,
        });
      }
    }
  );

  socket.on("like", async (data: Likes) => {
    const { threadId, liker } = data;

    const author = await getAuthorService(threadId);

    if (author && author.socketId) {
      socket.to(author.socketId).emit("liked", {
        liker,
      });
    }
  });

  socket.on("unlike", async (data: Unlikes) => {
    const { threadId, likerId } = data;
  });
});

httpServer.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
