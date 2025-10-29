import { Room } from "../../entities/Room";
import { ParticipantNotInTheRoomError } from "../../errors/ParticipantNotInTheRoomError";
import { RoomNotFoundError } from "../../errors/RoomNotFoundError";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { ClearRoomVotesDTO } from "./ClearRoomVotesDTO";

export class ClearRoomVotesUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  public async execute(data: ClearRoomVotesDTO): Promise<Room> {
    const room = await this.roomRepository.find({ id: data.roomId });
    if (!room) {
      throw new RoomNotFoundError();
    }

    if (!room.findParticipant(data.participantId)) {
      throw new ParticipantNotInTheRoomError();
    }

    room.clearVotes();
    room.hideVotes();
    await this.roomRepository.save(room);
    return room;
  }
}
