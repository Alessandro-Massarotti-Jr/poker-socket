import { HideRoomVotesUseCase } from "./HideRoomVotesUseCase";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { Room } from "../../entities/Room";
import { Participant } from "../../entities/Participant";
import { Name } from "../../entities/valueObjects/Name";
import { Vote } from "../../entities/valueObjects/Vote";
import { ParticipantNotInTheRoomError } from "../../errors/ParticipantNotInTheRoomError";
import { RoomNotFoundError } from "../../errors/RoomNotFoundError";

const roomRepository: IRoomRepository = jest.createMockFromModule(
  "../../repositories/roomRepository/implementations/RedisRoomRepository"
);

const hideRoomVotesUseCase = new HideRoomVotesUseCase(roomRepository);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("SetRoomVote unit tests", () => {
  it("should hide room votes", async () => {
    const sampleRoom = Room.create({ id: "1234" });
    const sampleParticipant = Participant.create({
      id: "12",
      name: new Name("teste"),
    });
    sampleParticipant.setVote(new Vote("10"));
    sampleRoom.addParticipant(sampleParticipant);
    sampleRoom.showVotes();
    roomRepository.find = jest.fn().mockResolvedValueOnce(sampleRoom);
    roomRepository.save = jest.fn().mockResolvedValueOnce(undefined);

    const hidedRoom = await hideRoomVotesUseCase.execute({
      roomId: "1234",
      participantId: "12",
    });

    expect(hidedRoom).toBe(sampleRoom);
    expect(JSON.parse(JSON.stringify(hidedRoom))).toEqual({
      hidden: true,
      id: "1234",
      participants: [
        {
          id: "12",
          name: "teste",
          vote: "10",
        },
      ],
    });

    expect(roomRepository.save).toHaveBeenCalledWith(sampleRoom);
    expect(roomRepository.find).toHaveBeenCalledWith({ id: "1234" });
  });

  it("should throw a error if participant not found in the room", async () => {
    const sampleRoom = Room.create({ id: "1234" });
    const sampleParticipant = Participant.create({
      id: "error",
      name: new Name("teste"),
    });
    sampleParticipant.setVote(new Vote("10"));
    sampleRoom.addParticipant(sampleParticipant);
    sampleRoom.showVotes();
    roomRepository.find = jest.fn().mockResolvedValueOnce(sampleRoom);
    roomRepository.save = jest.fn().mockResolvedValueOnce(undefined);

    await expect(
      hideRoomVotesUseCase.execute({
        roomId: "1234",
        participantId: "12",
      })
    ).rejects.toThrow(ParticipantNotInTheRoomError);

    expect(roomRepository.save).not.toHaveBeenCalled();
    expect(roomRepository.find).toHaveBeenCalledWith({ id: "1234" });
  });

  it("should throw a error if room was not found", async () => {
    roomRepository.find = jest.fn().mockResolvedValueOnce(null);
    roomRepository.save = jest.fn().mockResolvedValueOnce(undefined);
    await expect(
      hideRoomVotesUseCase.execute({
        roomId: "1234",
        participantId: "12",
      })
    ).rejects.toThrow(RoomNotFoundError);

    expect(roomRepository.save).not.toHaveBeenCalled();
    expect(roomRepository.find).toHaveBeenCalledWith({ id: "1234" });
  });
});
