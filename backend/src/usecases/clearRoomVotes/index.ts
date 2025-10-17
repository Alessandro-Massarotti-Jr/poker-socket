import { MemoryRoomRepository } from "../../repositories/roomRepository/implementations/MemoryRoomRepository";
import { ClearRoomVotesUseCase } from "./ClearRoomVotesUseCase";
import { ClearRoomVotesWebSocketController } from "./ClearRoomVotesWebSocketController";

const roomRepository = MemoryRoomRepository.getInstance();
const clearRoomVotesUseCase = new ClearRoomVotesUseCase(roomRepository);
const clearRoomVotesWebSocketController = new ClearRoomVotesWebSocketController(
  clearRoomVotesUseCase
);

export { clearRoomVotesUseCase, clearRoomVotesWebSocketController };
