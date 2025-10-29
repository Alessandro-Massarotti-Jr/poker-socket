import { Socket } from "socket.io";
import { HideRoomVotesUseCase } from "./HideRoomVotesUseCase";
import { InvalidParamsError } from "../../errors/InvalidParamsError";
import z from "zod";

export class HideRoomVotesWebSocketController {
  constructor(private readonly hideRoomVotesUseCase: HideRoomVotesUseCase) {}

  public async handle(socket: Socket, params: any) {
    const validation = z
      .object({
        roomId: z.string(),
      })
      .safeParse(params);

    if (!validation.success) {
      throw new InvalidParamsError({ message: validation.error.message });
    }

    const room = await this.hideRoomVotesUseCase.execute({
      participantId: socket.id,
      roomId: validation.data.roomId,
    });
    socket.emit("room:votesHidden", { room: room });
    socket.to(room.id).emit("room:votesHidden", { room: room });
  }
}
