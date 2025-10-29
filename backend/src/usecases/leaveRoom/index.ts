import { MemoryRoomRepository } from "../../repositories/roomRepository/implementations/MemoryRoomRepository";
import { LeaveRoomUseCase } from "./LeaveRoomUseCase";
import { LeaveRoomWebSocketController } from "./LeaveRoomWebSocketController";

const roomRepository = MemoryRoomRepository.getInstance();
const leaveRoomUseCase = new LeaveRoomUseCase(roomRepository);
const leaveRoomWebSocketController = new LeaveRoomWebSocketController(
  leaveRoomUseCase
);

export { leaveRoomUseCase, leaveRoomWebSocketController };
