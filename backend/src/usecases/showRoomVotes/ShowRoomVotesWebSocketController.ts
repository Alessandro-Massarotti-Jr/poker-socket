import { Socket } from "socket.io";
import { ShowRoomVotesUseCase } from "./ShowRoomVotesUseCase";
import { InvalidParamsError } from "../../errors/InvalidParamsError";
import z from "zod";

export class ShowRoomVotesWebSocketController {
  constructor(private readonly showRoomVotesUseCase: ShowRoomVotesUseCase) {}

  public async handle(socket: Socket, params: any) {
    const validation = z
      .object({
        roomId: z.string(),
      })
      .safeParse(params);

    if (!validation.success) {
      throw new InvalidParamsError({ message: validation.error.message });
    }

    const room = await this.showRoomVotesUseCase.execute({
      participantId: socket.id,
      roomId: validation.data.roomId,
    });
    socket.emit("room:votesShowed", { room: room });
    socket.to(room.id).emit("room:votesShowed", { room: room });
  }
}
