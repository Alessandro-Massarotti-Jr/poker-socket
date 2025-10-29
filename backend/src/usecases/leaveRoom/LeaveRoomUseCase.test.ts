import { LeaveRoomUseCase } from "./LeaveRoomUseCase";
import { MemoryRoomRepository } from "../../repositories/roomRepository/implementations/MemoryRoomRepository";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { Room } from "../../entities/Room";

const roomRepository: IRoomRepository = jest.mocked<IRoomRepository>(
  MemoryRoomRepository.getInstance()
);

const leaveRoomUseCase = new LeaveRoomUseCase(roomRepository);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("LeaveRoomUseCase", () => {
  it("should create a room", async () => {
    expect(
      leaveRoomUseCase.execute({
        roomId: "1234",
        participantId: "12",
      })
    ).resolves.toBeInstanceOf(Room);
  });
});
