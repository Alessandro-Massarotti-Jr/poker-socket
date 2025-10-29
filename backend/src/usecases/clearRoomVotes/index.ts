import { RedisRoomRepository } from "../../repositories/roomRepository/implementations/RedisRoomRepository";
import { ClearRoomVotesUseCase } from "./ClearRoomVotesUseCase";
import { ClearRoomVotesWebSocketController } from "./ClearRoomVotesWebSocketController";

const roomRepository = RedisRoomRepository.getInstance();
const clearRoomVotesUseCase = new ClearRoomVotesUseCase(roomRepository);
const clearRoomVotesWebSocketController = new ClearRoomVotesWebSocketController(
  clearRoomVotesUseCase
);

export { clearRoomVotesUseCase, clearRoomVotesWebSocketController };
