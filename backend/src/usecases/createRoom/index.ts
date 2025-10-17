import { MemoryRoomRepository } from "../../repositories/roomRepository/implementations/MemoryRoomRepository";
import { CreateRoomUsecase } from "./CreateRoomUseCase";
import { CreateRoomWebSocketController } from "./CreateRoomWebSocketController";

const roomRepository = MemoryRoomRepository.getInstance();
const createRoomUseCase = new CreateRoomUsecase(roomRepository);
const createRoomWebSocketController = new CreateRoomWebSocketController(
  createRoomUseCase
);

export { createRoomUseCase, createRoomWebSocketController };
