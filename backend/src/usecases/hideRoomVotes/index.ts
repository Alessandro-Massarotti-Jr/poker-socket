import { RedisRoomRepository } from "../../repositories/roomRepository/implementations/RedisRoomRepository";
import { HideRoomVotesUseCase } from "./HideRoomVotesUseCase";
import { HideRoomVotesWebSocketController } from "./HideRoomVotesWebSocketController";

const roomRepository = RedisRoomRepository.getInstance();
const hideRoomVotesUseCase = new HideRoomVotesUseCase(roomRepository);
const hideRoomVotesWebSocketController = new HideRoomVotesWebSocketController(
  hideRoomVotesUseCase
);

export { hideRoomVotesUseCase, hideRoomVotesWebSocketController };
