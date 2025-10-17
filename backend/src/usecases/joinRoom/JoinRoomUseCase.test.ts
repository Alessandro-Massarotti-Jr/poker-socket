import { JoinRoomUseCase } from "./JoinRoomUseCase";
import { MemoryRoomRepository } from "../../repositories/roomRepository/implementations/MemoryRoomRepository";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { Room } from "../../entities/Room";

const roomRepository: IRoomRepository = jest.mocked<IRoomRepository>(
  MemoryRoomRepository.getInstance()
);

const joinRoomUseCase = new JoinRoomUseCase(roomRepository);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("JoinRoomUseCase", () => {
  it("should create a room", async () => {
    expect(
      joinRoomUseCase.execute({
        roomId: "1234",
        participant: { id: "12", name: "participant" },
      })
    ).resolves.toBeInstanceOf(Room);
  });
});
