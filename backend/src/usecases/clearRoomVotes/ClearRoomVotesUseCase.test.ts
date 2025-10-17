import { SetRoomVoteUseCase } from "./ClearRoomVotesUseCase";
import { MemoryRoomRepository } from "../../repositories/roomRepository/implementations/MemoryRoomRepository";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { Room } from "../../entities/Room";

const roomRepository: IRoomRepository = jest.mocked<IRoomRepository>(
  MemoryRoomRepository.getInstance()
);

const setRoomVoteUseCase = new SetRoomVoteUseCase(roomRepository);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("SetRoomVote", () => {
  it("should create a room", async () => {
    expect(
      setRoomVoteUseCase.execute({
        roomId: "1234",
        participantId: "12",
        vote: "5",
      })
    ).resolves.toBeInstanceOf(Room);
  });
});
