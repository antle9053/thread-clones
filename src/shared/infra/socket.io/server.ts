"use server";
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  socket.on("foo", (data) => {
    socket.broadcast.emit("recieveData", data);
  });
});

httpServer.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
