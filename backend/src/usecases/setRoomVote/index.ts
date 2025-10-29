import { RedisRoomRepository } from "../../repositories/roomRepository/implementations/RedisRoomRepository";
import { SetRoomVoteUseCase } from "./SetRoomVoteUseCase";
import { SetRoomVoteWebSocketController } from "./SetRoomVoteWebSocketController";

const roomRepository = RedisRoomRepository.getInstance();
const setRoomVoteUseCase = new SetRoomVoteUseCase(roomRepository);
const setRoomVoteWebSocketController = new SetRoomVoteWebSocketController(
  setRoomVoteUseCase
);

export { setRoomVoteUseCase, setRoomVoteWebSocketController };
