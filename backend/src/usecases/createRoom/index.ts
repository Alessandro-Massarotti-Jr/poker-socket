import { RedisRoomRepository } from "../../repositories/roomRepository/implementations/RedisRoomRepository";
import { CreateRoomUsecase } from "./CreateRoomUseCase";
import { CreateRoomWebSocketController } from "./CreateRoomWebSocketController";

const roomRepository = RedisRoomRepository.getInstance();
const createRoomUseCase = new CreateRoomUsecase(roomRepository);
const createRoomWebSocketController = new CreateRoomWebSocketController(
  createRoomUseCase
);

export { createRoomUseCase, createRoomWebSocketController };
