import { RedisRoomRepository } from "../../repositories/roomRepository/implementations/RedisRoomRepository";
import { LeaveRoomUseCase } from "./LeaveRoomUseCase";
import { LeaveRoomWebSocketController } from "./LeaveRoomWebSocketController";

const roomRepository = RedisRoomRepository.getInstance();
const leaveRoomUseCase = new LeaveRoomUseCase(roomRepository);
const leaveRoomWebSocketController = new LeaveRoomWebSocketController(
  leaveRoomUseCase
);

export { leaveRoomUseCase, leaveRoomWebSocketController };
