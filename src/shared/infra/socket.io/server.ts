import { Unquotes } from "./events.type.d";
("use server");
import { createServer } from "http";
import { Server } from "socket.io";
import { prisma } from "../prisma";
import { getAuthorService } from "../../services/thread.service";
import {
  Likes,
  Unlikes,
  Mentions,
  Reposts,
  Unfollows,
  UnMentions,
  UnReposts,
  Quotes,
} from "./events.type";
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
          userId: followedId,
        });
      }
    }
  );

  socket.on("unfollow", async (data: Unfollows) => {
    const { followerId, followedId } = data;

    const followedUser = await prisma.users.findUnique({
      where: {
        id: followedId,
      },
    });
    if (followedUser && followedUser.socketId) {
      socket.to(followedUser.socketId).emit("unfollowed", {
        followerId,
        followedId,
      });
    }
  });

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
    if (author && author.socketId) {
      socket.to(author.socketId).emit("unliked", {
        likerId,
        authorId: author.id,
      });
    }
  });

  socket.on("mention", async (data: Mentions) => {
    const { mentionedUsernames, mentioner, threadId } = data;
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

    const thread = await prisma.threads.findUnique({
      where: {
        id: threadId,
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
        thread,
      });
  });

  socket.on("unmention", async (data: UnMentions) => {
    const { mentionedUsernames, mentionerId, threadId } = data;
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
    socket
      .to(
        socketIds
          .map((item) => item.socketId)
          .filter((id): id is string => typeof id === "string")
      )
      .emit("unmentioned", {
        mentionerId,
        threadId,
      });
  });

  socket.on("repost", async (data: Reposts) => {
    const { reposter, threadId } = data;
    const author = await getAuthorService(threadId);

    const thread = await prisma.threads.findUnique({
      where: {
        id: threadId,
      },
    });
    const notiId = nanoid();
    if (author && author.socketId) {
      socket.to(author?.socketId).emit("reposted", {
        reposter,
        notiId,
        thread,
      });
    }
  });

  socket.on("unrepost", async (data: UnReposts) => {
    const { reposterId, threadId } = data;
    const author = await getAuthorService(threadId);

    if (author && author.socketId) {
      socket.to(author?.socketId).emit("unreposted", {
        reposterId,
        repostedId: author?.id!,
        threadId,
      });
    }
  });

  socket.on("quote", async (data: Quotes) => {
    const { quoter, threadId } = data;

    const thread = await prisma.threads.findUnique({
      where: {
        id: threadId,
      },
    });
    const quotedThreadId = thread?.quotedThreadId;
    const author = await getAuthorService(quotedThreadId!);

    const notiId = nanoid();
    if (author && author.socketId) {
      socket.to(author?.socketId).emit("quoted", {
        quoter,
        notiId,
        thread,
      });
    }
  });

  socket.on("unquote", async (data: Unquotes) => {
    const { quoterId, threadId } = data;
    const thread = await prisma.threads.findUnique({
      where: {
        id: threadId,
      },
    });
    const quotedThreadId = thread?.quotedThreadId;
    const author = await getAuthorService(quotedThreadId!);

    if (author && author.socketId) {
      socket.to(author?.socketId).emit("unquoted", {
        quoterId,
        quotedId: author?.id!,
        threadId,
      });
    }
  });
});

httpServer.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
