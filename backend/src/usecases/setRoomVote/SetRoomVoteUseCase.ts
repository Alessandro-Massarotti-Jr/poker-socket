import { Room } from "../../entities/Room";
import { Vote } from "../../entities/valueObjects/Vote";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { SetRoomVoteDTO } from "./SetRoomVoteDTO";

export class SetRoomVoteUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  public async execute(data: SetRoomVoteDTO): Promise<Room> {
    const room = await this.roomRepository.find({ id: data.roomId });
    if (!room) {
      throw new Error("Room not found");
    }
    const participant = room.findParticipant(data.participantId);
    if (!participant) {
      throw new Error("Participant not found");
    }
    participant.setVote(new Vote(data.vote));
    room.addParticipant(participant);
    await this.roomRepository.save(room);
    return room;
  }
}
