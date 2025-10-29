import { Room } from "../../entities/Room";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { HideRoomVotesDTO } from "./HideRoomVotesDTO";

export class HideRoomVotesUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  public async execute(data: HideRoomVotesDTO): Promise<Room> {
    const room = await this.roomRepository.find({ id: data.roomId });
    if (!room) {
      throw new Error("Room not found");
    }
    const participant = room.findParticipant(data.participantId);
    if (!participant) {
      throw new Error("Participant not found");
    }
    room.hideVotes();
    await this.roomRepository.save(room);
    return room;
  }
}
