import { Room } from "../../../entities/Room";
import {
  DeleteDTO,
  DeleteReturnDTO,
  FindDTO,
  FindReturnDTO,
  SaveDTO,
  SaveReturnDTO,
} from "../dtos/RoomRepositoryDTOs";
import { IRoomRepository } from "../interfaces/IRoomRepository";

export class MemoryRoomRepository implements IRoomRepository {
  private static instance: IRoomRepository;

  private data: Map<string, Room> = new Map();

  public static getInstance(): IRoomRepository {
    if (!MemoryRoomRepository.instance) {
      MemoryRoomRepository.instance = new MemoryRoomRepository();
    }
    return MemoryRoomRepository.instance;
  }

  async find(data: FindDTO): Promise<FindReturnDTO> {
    const roomData = this.data.get(data.id);

    if (!roomData) {
      return null;
    }

    const room = Room.create(roomData);

    if (roomData.participants?.length) {
      for (const participant of roomData.participants) {
        room.addParticipant(participant);
      }
    }

    if (!roomData.hidden) {
      room.showVotes();
    }

    return room;
  }
  async save(data: SaveDTO): Promise<SaveReturnDTO> {
    this.data.set(data.id, data);
  }

  async delete(data: DeleteDTO): Promise<DeleteReturnDTO> {
    this.data.delete(data.id);
  }
}
