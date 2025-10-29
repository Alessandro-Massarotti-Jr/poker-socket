import { RedisRoomRepository } from "../../repositories/roomRepository/implementations/RedisRoomRepository";
import { ShowRoomVotesUseCase } from "./ShowRoomVotesUseCase";
import { ShowRoomVotesWebSocketController } from "./ShowRoomVotesWebSocketController";

const roomRepository = RedisRoomRepository.getInstance();
const showRoomVotesUseCase = new ShowRoomVotesUseCase(roomRepository);
const showRoomVotesWebSocketController = new ShowRoomVotesWebSocketController(
  showRoomVotesUseCase
);

export { showRoomVotesUseCase, showRoomVotesWebSocketController };
