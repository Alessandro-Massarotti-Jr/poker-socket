import { LeaveRoomUseCase } from "./LeaveRoomUseCase";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { Room } from "../../entities/Room";
import { Participant } from "../../entities/Participant";
import { Name } from "../../entities/valueObjects/Name";
import { RoomNotFoundError } from "../../errors/RoomNotFoundError";

const roomRepository: IRoomRepository = jest.createMockFromModule(
  "../../repositories/roomRepository/implementations/RedisRoomRepository"
);

const leaveRoomUseCase = new LeaveRoomUseCase(roomRepository);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("LeaveRoomUseCase", () => {
  it("should leave a room", async () => {
    const sampleRoom = Room.create({ id: "1234" });
    const sampleParticipant = Participant.create({
      id: "12",
      name: new Name("teste"),
    });

    const sampleParticipantTwo = Participant.create({
      id: "21",
      name: new Name("two"),
    });

    sampleRoom.addParticipant(sampleParticipant);
    sampleRoom.addParticipant(sampleParticipantTwo);
    roomRepository.find = jest.fn().mockResolvedValueOnce(sampleRoom);
    roomRepository.save = jest.fn().mockResolvedValueOnce(undefined);
    roomRepository.delete = jest.fn().mockResolvedValueOnce(undefined);

    const leavedRoom = await leaveRoomUseCase.execute({
      roomId: "1234",
      participantId: "12",
    });
    expect(leavedRoom).toBe(sampleRoom);
    expect(JSON.parse(JSON.stringify(leavedRoom))).toEqual({
      hidden: true,
      id: "1234",
      participants: [
        {
          id: "21",
          name: "two",
          vote: null,
        },
      ],
    });
    expect(roomRepository.find).toHaveBeenCalledWith({ id: "1234" });
    expect(roomRepository.save).toHaveBeenCalledWith(sampleRoom);
    expect(roomRepository.delete).not.toHaveBeenCalled();
  });

  it("should delete a room if participants list is empty", async () => {
    const sampleRoom = Room.create({ id: "1234" });
    const sampleParticipant = Participant.create({
      id: "12",
      name: new Name("teste"),
    });

    sampleRoom.addParticipant(sampleParticipant);
    roomRepository.find = jest.fn().mockResolvedValueOnce(sampleRoom);
    roomRepository.save = jest.fn().mockResolvedValueOnce(undefined);
    roomRepository.delete = jest.fn().mockResolvedValueOnce(undefined);

    await expect(
      leaveRoomUseCase.execute({
        roomId: "1234",
        participantId: "12",
      })
    ).resolves.toBeUndefined();

    expect(roomRepository.find).toHaveBeenCalledWith({ id: "1234" });
    expect(roomRepository.delete).toHaveBeenCalledWith({ id: "1234" });
    expect(roomRepository.save).not.toHaveBeenCalled();
  });

  it("should throw a error if room was not found", async () => {
    roomRepository.find = jest.fn().mockResolvedValueOnce(null);
    roomRepository.save = jest.fn().mockResolvedValueOnce(undefined);
    roomRepository.delete = jest.fn().mockResolvedValueOnce(undefined);
    await expect(
      leaveRoomUseCase.execute({
        roomId: "1234",
        participantId: "12",
      })
    ).rejects.toThrow(RoomNotFoundError);

    expect(roomRepository.find).toHaveBeenCalledWith({ id: "1234" });
    expect(roomRepository.delete).not.toHaveBeenCalled();
    expect(roomRepository.save).not.toHaveBeenCalled();
  });
});
