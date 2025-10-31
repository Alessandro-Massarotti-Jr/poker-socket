import { SetRoomVoteUseCase } from "./SetRoomVoteUseCase";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { Room } from "../../entities/Room";
import { Name } from "../../entities/valueObjects/Name";
import { Participant } from "../../entities/Participant";
import { ParticipantNotInTheRoomError } from "../../errors/ParticipantNotInTheRoomError";
import { RoomNotFoundError } from "../../errors/RoomNotFoundError";

const roomRepository: IRoomRepository = jest.createMockFromModule(
  "../../repositories/roomRepository/implementations/RedisRoomRepository"
);

const setRoomVoteUseCase = new SetRoomVoteUseCase(roomRepository);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("SetRoomVote unit tests", () => {
  it("should set a room vote", async () => {
    const sampleRoom = Room.create({ id: "1234" });
    const sampleParticipant = Participant.create({
      id: "12",
      name: new Name("teste"),
    });

    sampleRoom.addParticipant(sampleParticipant);
    roomRepository.find = jest.fn().mockResolvedValueOnce(sampleRoom);
    roomRepository.save = jest.fn().mockResolvedValueOnce(undefined);

    const votedRoom = await setRoomVoteUseCase.execute({
      roomId: "1234",
      participantId: "12",
      vote: "5",
    });

    expect(votedRoom).toBe(sampleRoom);

    expect(JSON.parse(JSON.stringify(votedRoom))).toEqual({
      hidden: true,
      id: "1234",
      participants: [
        {
          id: "12",
          name: "teste",
          vote: "5",
        },
      ],
    });

    expect(roomRepository.save).toHaveBeenCalledWith(sampleRoom);
    expect(roomRepository.find).toHaveBeenCalledWith({ id: "1234" });
  });

  it("should throw a error if participant was not in the room", async () => {
    const sampleRoom = Room.create({ id: "1234" });
    roomRepository.find = jest.fn().mockResolvedValueOnce(sampleRoom);
    roomRepository.save = jest.fn().mockResolvedValueOnce(undefined);

    await expect(
      setRoomVoteUseCase.execute({
        roomId: "1234",
        participantId: "12",
        vote: "5",
      })
    ).rejects.toThrow(ParticipantNotInTheRoomError);

    expect(roomRepository.save).not.toHaveBeenCalled();
    expect(roomRepository.find).toHaveBeenCalledWith({ id: "1234" });
  });

  it("should throw a error if room was not found", async () => {
    roomRepository.find = jest.fn().mockResolvedValueOnce(null);
    roomRepository.save = jest.fn().mockResolvedValueOnce(undefined);

    await expect(
      setRoomVoteUseCase.execute({
        roomId: "1234",
        participantId: "12",
        vote: "5",
      })
    ).rejects.toThrow(RoomNotFoundError);

    expect(roomRepository.save).not.toHaveBeenCalled();
    expect(roomRepository.find).toHaveBeenCalledWith({ id: "1234" });
  });
});
