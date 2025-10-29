import { Socket } from "socket.io";
import { SetRoomVoteUseCase } from "./SetRoomVoteUseCase";
import { InvalidParamsError } from "../../errors/InvalidParamsError";
import z from "zod";

export class SetRoomVoteWebSocketController {
  constructor(private readonly setRoomVoteUseCase: SetRoomVoteUseCase) {}

  public async handle(socket: Socket, params: any) {
    const validation = z
      .object({
        vote: z.string(),
        roomId: z.string(),
      })
      .safeParse(params);

    if (!validation.success) {
      throw new InvalidParamsError({ message: validation.error.message });
    }

    const room = await this.setRoomVoteUseCase.execute({
      participantId: socket.id,
      roomId: validation.data.roomId,
      vote: validation.data.vote,
    });
    socket.emit("room:voted", { room: room });
    socket.to(room.id).emit("room:voted", { room: room });
  }
}
