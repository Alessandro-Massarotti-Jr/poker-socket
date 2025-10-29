import { MemoryRoomRepository } from "../../repositories/roomRepository/implementations/MemoryRoomRepository";
import { HideRoomVotesUseCase } from "./HideRoomVotesUseCase";
import { HideRoomVotesWebSocketController } from "./HideRoomVotesWebSocketController";

const roomRepository = MemoryRoomRepository.getInstance();
const hideRoomVotesUseCase = new HideRoomVotesUseCase(roomRepository);
const hideRoomVotesWebSocketController = new HideRoomVotesWebSocketController(
  hideRoomVotesUseCase
);

export { hideRoomVotesUseCase, hideRoomVotesWebSocketController };
