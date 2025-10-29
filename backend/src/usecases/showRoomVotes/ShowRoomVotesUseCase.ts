import { Room } from "../../entities/Room";
import { Vote } from "../../entities/valueObjects/Vote";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { ShowRoomVotesDTO } from "./ShowRoomVotesDTO";

export class ShowRoomVotesUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  public async execute(data: ShowRoomVotesDTO): Promise<Room> {
    const room = await this.roomRepository.find({ id: data.roomId });
    if (!room) {
      throw new Error("Room not found");
    }
    const participant = room.findParticipant(data.participantId);
    if (!participant) {
      throw new Error("Participant not found");
    }
    room.showVotes();
    await this.roomRepository.save(room);
    return room;
  }
}
