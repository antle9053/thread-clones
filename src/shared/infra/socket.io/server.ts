"use server";
import { createServer } from "http";
import { Server } from "socket.io";
import { prisma } from "../prisma";
import { getAuthorService } from "../../services/thread.service";
import { Likes, Unlikes, Mentions } from "./events.type";
import { nanoid } from "nanoid";

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

      const notiId = nanoid();

      if (followedUser && followedUser.socketId) {
        socket.to(followedUser.socketId).emit("followed", {
          notiId,
          following,
        });
      }
    }
  );

  socket.on("like", async (data: Likes) => {
    const { threadId, liker } = data;

    const author = await getAuthorService(threadId);
    const notiId = nanoid();

    if (author && author.socketId) {
      socket.to(author.socketId).emit("liked", {
        notiId,
        liker,
        userId: author.id,
      });
    }
  });

  socket.on("unlike", async (data: Unlikes) => {
    const { threadId, likerId } = data;

    const author = await getAuthorService(threadId);
    const notiId = nanoid();
    if (author && author.socketId) {
      socket.to(author.socketId).emit("unliked", {
        likerId,
        authorId: author.id,
        notiId,
      });
    }
  });

  socket.on("mention", async (data: Mentions) => {
    const { mentionedUsernames, mentioner, content } = data;
    const socketIds = await prisma.users.findMany({
      where: {
        username: {
          in: mentionedUsernames,
        },
      },
      select: {
        socketId: true,
      },
    });
    const notiId = nanoid();
    socket
      .to(
        socketIds
          .map((item) => item.socketId)
          .filter((id): id is string => typeof id === "string")
      )
      .emit("mentioned", {
        mentioner,
        notiId,
        content,
      });
  });
});

httpServer.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
