import { Socket } from "socket.io";
import { CreateRoomUsecase } from "./CreateRoomUseCase";
import z from "zod";
import { InvalidParamsError } from "../../errors/InvalidParamsError";

export class CreateRoomWebSocketController {
  constructor(private readonly createRoomUseCase: CreateRoomUsecase) {}

  public async handle(socket: Socket, params: any) {
    const validation = z
      .object({
        participantName: z.string(),
      })
      .safeParse(params);

    if (!validation.success) {
      throw new InvalidParamsError({ message: validation.error.message });
    }

    const room = await this.createRoomUseCase.execute({
      participant: { id: socket.id, name: validation.data.participantName },
    });
    socket.join(room.id);
    socket.emit("room:created", { room: room });
  }
}
