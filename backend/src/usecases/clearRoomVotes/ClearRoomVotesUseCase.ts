import { Room } from "../../entities/Room";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { ClearRoomVotesDTO } from "./ClearRoomVotesDTO";

export class ClearRoomVotesUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  public async execute(data: ClearRoomVotesDTO): Promise<Room> {
    const room = await this.roomRepository.find({ id: data.roomId });
    if (!room) {
      throw new Error("Room not found");
    }

    if (!room.findParticipant(data.participantId)) {
      throw new Error("Participant not from this room");
    }

    room.clearVotes();
    room.hideVotes();
    await this.roomRepository.save(room);
    return room;
  }
}
