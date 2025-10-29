import { Socket, Server as WebSocketServer } from "socket.io";
import { createRoomWebSocketController } from "./usecases/createRoom";
import { joinRoomWebSocketController } from "./usecases/joinRoom";
import { setRoomVoteWebSocketController } from "./usecases/setRoomVote";
import { clearRoomVotesWebSocketController } from "./usecases/clearRoomVotes";
import { CustomError } from "./errors/CustomError";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { leaveRoomWebSocketController } from "./usecases/leaveRoom";

const publisherClient = createClient({
  url: process.env.REDIS_URL as string,
  username: process.env.REDIS_USER as string,
  password: process.env.REDIS_PASSWORD as string,
});
const subscriberClient = publisherClient.duplicate();

Promise.all([publisherClient.connect(), subscriberClient.connect()]);

const webSocketServer = new WebSocketServer({
  adapter: createAdapter(publisherClient, subscriberClient),
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const handlers = new Map<
  string,
  (socket: Socket, params: any) => Promise<void>
>([
  [
    "room:create",
    async (socket, params) => {
      await createRoomWebSocketController.handle(socket, params);
    },
  ],
  [
    "room:join",
    async (socket, params) => {
      await joinRoomWebSocketController.handle(socket, params);
    },
  ],
  [
    "room:vote",
    async (socket, params) => {
      await setRoomVoteWebSocketController.handle(socket, params);
    },
  ],
  [
    "room:clearVotes",
    async (socket, params) => {
      await clearRoomVotesWebSocketController.handle(socket, params);
    },
  ],
]);

webSocketServer.on("connection", (socket) => {
  console.log(`conected ${socket.id}`);
  for (const [event, handler] of handlers) {
    socket.on(event, async (params) => {
      try {
        await handler(socket, params);
      } catch (error) {
        if (error instanceof CustomError) {
          socket.emit(error.socketEvent ?? "aplication:error", error.toJSON());
          return;
        }
        socket.emit(
          "aplication:error",
          new CustomError({ message: "Unexpected error" }).toJSON()
        );
      }
    });
  }

  socket.on("disconnecting", async (reason) => {
    for (const roomId of socket.rooms) {
      leaveRoomWebSocketController
        .handle(socket, { roomId })
        .catch((error) => {});
    }
  });

  socket.on("disconnect", async (reason) => {
    for (const roomId of socket.rooms) {
      leaveRoomWebSocketController
        .handle(socket, { roomId })
        .catch((error) => {});
    }
  });
});

webSocketServer.on("error", (error) => {
  console.error("webSocketServer error:", error);
});

webSocketServer.on("close", () => {
  console.log("Servidor Socket.IO encerrado");
});

const shutdown = async () => {
  webSocketServer.emit("server:error", { message: "Servidor sendo encerrado" });
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await webSocketServer.close();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export { webSocketServer };
