import { Participant } from "../../entities/Participant";
import { Room } from "../../entities/Room";
import { Name } from "../../entities/valueObjects/Name";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { CreateRoomDTO } from "./CreateRoomDTO";

export class CreateRoomUsecase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  public async execute(data: CreateRoomDTO): Promise<Room> {
    const participant = Participant.create({
      id: data.participant.id,
      name: new Name(data.participant.name),
    });
    const room = Room.create({
      id: "1234",
    });
    room.addParticipant(participant);
    this.roomRepository.save(room);

    return room;
  }
}
