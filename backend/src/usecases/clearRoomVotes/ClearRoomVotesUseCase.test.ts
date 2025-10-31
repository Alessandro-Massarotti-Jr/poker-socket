import { ClearRoomVotesUseCase } from "./ClearRoomVotesUseCase";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { Room } from "../../entities/Room";
import { Name } from "../../entities/valueObjects/Name";
import { Participant } from "../../entities/Participant";
import { ParticipantNotInTheRoomError } from "../../errors/ParticipantNotInTheRoomError";
import { RoomNotFoundError } from "../../errors/RoomNotFoundError";
import { Vote } from "../../entities/valueObjects/Vote";

const roomRepository: IRoomRepository = jest.createMockFromModule(
  "../../repositories/roomRepository/implementations/RedisRoomRepository"
);

const clearRoomVotesUseCase = new ClearRoomVotesUseCase(roomRepository);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("ClearRoomVotesUseCase unit tests", () => {
  it("should clear room votes", async () => {
    const sampleRoom = Room.create({});
    const sampleParticipant = Participant.create({
      id: "12",
      name: new Name("teste"),
    });
    sampleParticipant.setVote(new Vote("10"));
    sampleRoom.addParticipant(sampleParticipant);
    roomRepository.find = jest.fn().mockResolvedValueOnce(sampleRoom);
    roomRepository.save = jest.fn().mockResolvedValueOnce(undefined);

    const clearedRoomVotes = await clearRoomVotesUseCase.execute({
      roomId: "1234",
      participantId: "12",
    });

    expect(clearedRoomVotes).toBe(sampleRoom);

    expect(JSON.parse(JSON.stringify(clearedRoomVotes))).toEqual({
      hidden: true,
      id: expect.any(String),
      participants: [
        {
          id: "12",
          name: "teste",
          vote: null,
        },
      ],
    });

    expect(roomRepository.find).toHaveBeenCalledWith({
      id: "1234",
    });

    expect(roomRepository.save).toHaveBeenCalledWith(sampleRoom);
  });

  it("should throw a error if current user is not present in the room", async () => {
    const sampleRoom = Room.create({});
    sampleRoom.addParticipant(
      Participant.create({ id: "error", name: new Name("teste") })
    );
    roomRepository.find = jest.fn().mockResolvedValueOnce(sampleRoom);
    roomRepository.save = jest.fn().mockResolvedValueOnce(undefined);

    await expect(
      clearRoomVotesUseCase.execute({
        roomId: "1234",
        participantId: "12",
      })
    ).rejects.toThrow(ParticipantNotInTheRoomError);

    expect(roomRepository.find).toHaveBeenCalledWith({
      id: "1234",
    });

    expect(roomRepository.save).not.toHaveBeenCalled();
  });

  it("should throw a error if room was not found", async () => {
    roomRepository.find = jest.fn().mockResolvedValueOnce(null);
    await expect(
      clearRoomVotesUseCase.execute({
        roomId: "1234",
        participantId: "12",
      })
    ).rejects.toThrow(RoomNotFoundError);
    expect(roomRepository.find).toHaveBeenCalledWith({
      id: "1234",
    });
    expect(roomRepository.save).not.toHaveBeenCalled();
  });
});
