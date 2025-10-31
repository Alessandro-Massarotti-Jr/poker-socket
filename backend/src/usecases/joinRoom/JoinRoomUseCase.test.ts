import { JoinRoomUseCase } from "./JoinRoomUseCase";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { Room } from "../../entities/Room";
import { Name } from "../../entities/valueObjects/Name";
import { Participant } from "../../entities/Participant";
import { RoomNotFoundError } from "../../errors/RoomNotFoundError";

const roomRepository: IRoomRepository = jest.createMockFromModule(
  "../../repositories/roomRepository/implementations/RedisRoomRepository"
);

const joinRoomUseCase = new JoinRoomUseCase(roomRepository);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("JoinRoomUseCase unit tests", () => {
  it("should join a room", async () => {
    const sampleRoom = Room.create({ id: "1234" });
    roomRepository.find = jest.fn().mockResolvedValueOnce(sampleRoom);
    roomRepository.save = jest.fn().mockResolvedValueOnce(undefined);
    const joinedRoom = await joinRoomUseCase.execute({
      roomId: "1234",
      participant: { id: "12", name: "participant" },
    });

    expect(joinedRoom).toBe(sampleRoom);
    expect(JSON.parse(JSON.stringify(joinedRoom))).toEqual({
      hidden: true,
      id: "1234",
      participants: [
        {
          id: "12",
          name: "participant",
          vote: null,
        },
      ],
    });
    expect(roomRepository.save).toHaveBeenCalledWith(sampleRoom);
    expect(roomRepository.find).toHaveBeenCalledWith({ id: "1234" });
  });

  it("should early return if participant was already in the room", async () => {
    const sampleRoom = Room.create({ id: "1234" });
    const sampleParticipant = Participant.create({
      id: "12",
      name: new Name("teste"),
    });

    sampleRoom.addParticipant(sampleParticipant);
    roomRepository.find = jest.fn().mockResolvedValueOnce(sampleRoom);
    roomRepository.save = jest.fn().mockResolvedValueOnce(undefined);
    const joinedRoom = await joinRoomUseCase.execute({
      roomId: "1234",
      participant: { id: "12", name: "participant" },
    });

    expect(joinedRoom).toBe(sampleRoom);
    expect(JSON.parse(JSON.stringify(joinedRoom))).toEqual({
      hidden: true,
      id: "1234",
      participants: [
        {
          id: "12",
          name: "teste",
          vote: null,
        },
      ],
    });
    expect(roomRepository.save).not.toHaveBeenCalled();
    expect(roomRepository.find).toHaveBeenCalledWith({ id: "1234" });
  });

  it("should throw a error if not found the room", async () => {
    roomRepository.find = jest.fn().mockResolvedValueOnce(null);
    roomRepository.save = jest.fn().mockResolvedValueOnce(undefined);
    await expect(
      joinRoomUseCase.execute({
        roomId: "1234",
        participant: { id: "12", name: "participant" },
      })
    ).rejects.toThrow(RoomNotFoundError);

    expect(roomRepository.save).not.toHaveBeenCalled();
    expect(roomRepository.find).toHaveBeenCalledWith({ id: "1234" });
  });
});
