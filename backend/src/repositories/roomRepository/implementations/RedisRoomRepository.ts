import { createClient, RedisClientType } from "redis";
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
import { Participant } from "../../../entities/Participant";
import { Vote } from "../../../entities/valueObjects/Vote";
import { Name } from "../../../entities/valueObjects/Name";

export class RedisRoomRepository implements IRoomRepository {
  private static instance: IRoomRepository;
  private client: RedisClientType;

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL as string,
      username: process.env.REDIS_USER as string,
      password: process.env.REDIS_PASSWORD as string,
    });

    this.client.connect().catch((err) => {
      console.error("Redis connection error:", err);
    });
  }

  public static getInstance(): IRoomRepository {
    if (!RedisRoomRepository.instance) {
      RedisRoomRepository.instance = new RedisRoomRepository();
    }
    return RedisRoomRepository.instance;
  }

  private getRoomKey(id: string): string {
    return `room:${id}`;
  }

  async find(data: FindDTO): Promise<FindReturnDTO> {
    const key = this.getRoomKey(data.id);
    const roomJson = await this.client.get(key);
    if (!roomJson) return null;
    const roomData = JSON.parse(roomJson);
    const room = Room.create(roomData);
    if (roomData.participants?.length) {
      for (const participantData of roomData.participants) {
        const participant = Participant.create({
          id: participantData.id,
          name: new Name(participantData.name),
        });
        if (participantData.vote) {
          participant.setVote(new Vote(participantData.vote));
        }
        room.addParticipant(participant);
      }
    }
    if (!roomData.hidden) {
      room.showVotes();
    }
    return room;
  }

  async save(data: SaveDTO): Promise<SaveReturnDTO> {
    const key = this.getRoomKey(data.id);
    await this.client.set(key, JSON.stringify(data), {
      expiration: { type: "EX", value: 60 * 60 * 12 },
    });
  }

  async delete(data: DeleteDTO): Promise<DeleteReturnDTO> {
    const key = this.getRoomKey(data.id);
    await this.client.del(key);
  }
}
