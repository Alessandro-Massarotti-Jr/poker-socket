import { Participant } from "../../entities/Participant";
import { Room } from "../../entities/Room";
import { Name } from "../../entities/valueObjects/Name";
import { RoomNotFoundError } from "../../errors/RoomNotFoundError";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { JoinRoomDTO } from "./JoinRoomDTO";

export class JoinRoomUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  public async execute(data: JoinRoomDTO): Promise<Room> {
    const room = await this.roomRepository.find({ id: data.roomId });

    if (!room) {
      throw new RoomNotFoundError();
    }

    if (room.findParticipant(data.participant.id)) {
      return room;
    }

    const participant = Participant.create({
      id: data.participant.id,
      name: new Name(data.participant.name),
    });

    room.addParticipant(participant);
    await this.roomRepository.save(room);

    return room;
  }
}
