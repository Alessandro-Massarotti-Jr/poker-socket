import { Socket } from "socket.io";
import { JoinRoomUseCase } from "./JoinRoomUseCase";
import z from "zod";
import { InvalidParamsError } from "../../errors/InvalidParamsError";

export class JoinRoomWebSocketController {
  constructor(private readonly joinRoomUseCase: JoinRoomUseCase) {}

  public async handle(socket: Socket, params: any) {
    const validation = z
      .object({
        participantName: z.string(),
        roomId: z.string(),
      })
      .safeParse(params);

    if (!validation.success) {
      throw new InvalidParamsError({ message: validation.error.message });
    }

    const room = await this.joinRoomUseCase.execute({
      roomId: validation.data.roomId,
      participant: { id: socket.id, name: validation.data.participantName },
    });
    socket.join(room.id);
    socket.in(room.id).emit("room:Joined", { room: room });
  }
}
