import { MemoryRoomRepository } from "../../repositories/roomRepository/implementations/MemoryRoomRepository";
import { ShowRoomVotesUseCase } from "./ShowRoomVotesUseCase";
import { ShowRoomVotesWebSocketController } from "./ShowRoomVotesWebSocketController";

const roomRepository = MemoryRoomRepository.getInstance();
const showRoomVotesUseCase = new ShowRoomVotesUseCase(roomRepository);
const showRoomVotesWebSocketController = new ShowRoomVotesWebSocketController(
  showRoomVotesUseCase
);

export { showRoomVotesUseCase, showRoomVotesWebSocketController };
