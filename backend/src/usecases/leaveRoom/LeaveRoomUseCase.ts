import { Participant } from "../../entities/Participant";
import { Room } from "../../entities/Room";
import { Name } from "../../entities/valueObjects/Name";
import { RoomNotFoundError } from "../../errors/RoomNotFoundError";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { LeaveRoomDTO } from "./LeaveRoomDTO";

export class LeaveRoomUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  public async execute(data: LeaveRoomDTO): Promise<Room | void> {
    const room = await this.roomRepository.find({ id: data.roomId });
    if (!room) {
      throw new RoomNotFoundError();
    }
    room.removeParticipant(data.participantId);

    if (room.hasParticipants()) {
      await this.roomRepository.save(room);
      return room;
    }
    await this.roomRepository.delete({ id: room.id });
    return;
  }
}
