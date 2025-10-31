import { Socket } from "socket.io";
import { LeaveRoomUseCase } from "./LeaveRoomUseCase";
import z from "zod";
import { InvalidParamsError } from "../../errors/InvalidParamsError";

export class LeaveRoomWebSocketController {
  constructor(private readonly leaveRoomUseCase: LeaveRoomUseCase) {}

  public async handle(socket: Socket, params: any) {
    const validation = z
      .object({
        roomId: z.string(),
      })
      .safeParse(params);

    if (!validation.success) {
      throw new InvalidParamsError({ message: validation.error.message });
    }

    const room = await this.leaveRoomUseCase.execute({
      roomId: validation.data.roomId,
      participantId: socket.id,
    });
    if (socket.rooms.has(validation.data.roomId)) {
      socket.leave(validation.data.roomId);
    }
    if (room) {
      socket.to(room.id).emit("room:left", { room: room });
    }
  }
}
