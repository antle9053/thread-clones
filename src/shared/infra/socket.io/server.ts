"use server";
import { createServer } from "http";
import { Server } from "socket.io";
import { prisma } from "../prisma";

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

      if (followedUser && followedUser.socketId) {
        socket.to(followedUser.socketId).emit("followed", {
          followingName,
        });
      }
    }
  );
});

httpServer.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
