import { MemoryRoomRepository } from "../../repositories/roomRepository/implementations/MemoryRoomRepository";
import { JoinRoomUseCase } from "./JoinRoomUseCase";
import { JoinRoomWebSocketController } from "./JoinRoomWebSocketController";

const roomRepository = MemoryRoomRepository.getInstance();
const joinRoomUseCase = new JoinRoomUseCase(roomRepository);
const joinRoomWebSocketController = new JoinRoomWebSocketController(
  joinRoomUseCase
);

export { joinRoomUseCase, joinRoomWebSocketController };
