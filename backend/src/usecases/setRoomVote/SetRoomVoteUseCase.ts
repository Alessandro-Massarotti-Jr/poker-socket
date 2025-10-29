import { Room } from "../../entities/Room";
import { Vote } from "../../entities/valueObjects/Vote";
import { ParticipantNotInTheRoomError } from "../../errors/ParticipantNotInTheRoomError";
import { RoomNotFoundError } from "../../errors/RoomNotFoundError";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { SetRoomVoteDTO } from "./SetRoomVoteDTO";

export class SetRoomVoteUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  public async execute(data: SetRoomVoteDTO): Promise<Room> {
    const room = await this.roomRepository.find({ id: data.roomId });
    if (!room) {
      throw new RoomNotFoundError();
    }
    const participant = room.findParticipant(data.participantId);
    if (!participant) {
      throw new ParticipantNotInTheRoomError();
    }
    participant.setVote(new Vote(data.vote));
    await this.roomRepository.save(room);
    return room;
  }
}
