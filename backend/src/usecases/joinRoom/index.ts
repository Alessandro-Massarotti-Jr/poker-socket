import { RedisRoomRepository } from "../../repositories/roomRepository/implementations/RedisRoomRepository";
import { JoinRoomUseCase } from "./JoinRoomUseCase";
import { JoinRoomWebSocketController } from "./JoinRoomWebSocketController";

const roomRepository = RedisRoomRepository.getInstance();
const joinRoomUseCase = new JoinRoomUseCase(roomRepository);
const joinRoomWebSocketController = new JoinRoomWebSocketController(
  joinRoomUseCase
);

export { joinRoomUseCase, joinRoomWebSocketController };
