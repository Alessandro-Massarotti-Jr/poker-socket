import { Socket } from "socket.io";
import { ClearRoomVotesUseCase } from "./ClearRoomVotesUseCase";
import z from "zod";
import { InvalidParamsError } from "../../errors/InvalidParamsError";

export class ClearRoomVotesWebSocketController {
  constructor(private readonly clearRoomVotesUseCase: ClearRoomVotesUseCase) {}

  public async handle(socket: Socket, params: any) {
    const validation = z
      .object({
        roomId: z.string(),
      })
      .safeParse(params);

    if (!validation.success) {
      throw new InvalidParamsError({ message: validation.error.message });
    }

    const room = await this.clearRoomVotesUseCase.execute({
      roomId: validation.data.roomId,
      participantId: socket.id,
    });
    socket.emit("room:clearedVotes", { room: room });
    socket.to(room.id).emit("room:clearedVotes", { room: room });
  }
}
