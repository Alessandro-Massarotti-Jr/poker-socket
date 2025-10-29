import { Room } from "../../entities/Room";
import { ParticipantNotInTheRoomError } from "../../errors/ParticipantNotInTheRoomError";
import { RoomNotFoundError } from "../../errors/RoomNotFoundError";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { HideRoomVotesDTO } from "./HideRoomVotesDTO";

export class HideRoomVotesUseCase {
  constructor(private readonly roomRepository: IRoomRepository) {}

  public async execute(data: HideRoomVotesDTO): Promise<Room> {
    const room = await this.roomRepository.find({ id: data.roomId });
    if (!room) {
      throw new RoomNotFoundError();
    }
    const participant = room.findParticipant(data.participantId);
    if (!participant) {
      throw new ParticipantNotInTheRoomError();
    }
    room.hideVotes();
    await this.roomRepository.save(room);
    return room;
  }
}
