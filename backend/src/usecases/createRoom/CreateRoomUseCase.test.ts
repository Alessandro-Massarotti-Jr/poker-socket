import { CreateRoomUsecase } from "./CreateRoomUseCase";
import { MemoryRoomRepository } from "../../repositories/roomRepository/implementations/MemoryRoomRepository";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { Room } from "../../entities/Room";

const roomRepository: IRoomRepository = jest.mocked<IRoomRepository>(
  MemoryRoomRepository.getInstance()
);

const createRoomUseCase = new CreateRoomUsecase(roomRepository);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("CreateRoomUseCase", () => {
  it("should create a room", async () => {
    expect(
      createRoomUseCase.execute({
        participant: { id: "12", name: "participant" },
      })
    ).resolves.toBeInstanceOf(Room);
  });
});
