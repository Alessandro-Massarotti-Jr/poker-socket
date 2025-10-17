import { MemoryRoomRepository } from "../../repositories/roomRepository/implementations/MemoryRoomRepository";
import { SetRoomVoteUseCase } from "./SetRoomVoteUseCase";
import { SetRoomVoteWebSocketController } from "./SetRoomVoteWebSocketController";

const roomRepository = MemoryRoomRepository.getInstance();
const setRoomVoteUseCase = new SetRoomVoteUseCase(roomRepository);
const setRoomVoteWebSocketController = new SetRoomVoteWebSocketController(
  setRoomVoteUseCase
);

export { setRoomVoteUseCase, setRoomVoteWebSocketController };
