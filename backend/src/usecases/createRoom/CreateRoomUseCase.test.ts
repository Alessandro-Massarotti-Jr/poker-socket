import { CreateRoomUsecase } from "./CreateRoomUseCase";
import { IRoomRepository } from "../../repositories/roomRepository/interfaces/IRoomRepository";
import { Room } from "../../entities/Room";

const roomRepository: IRoomRepository = jest.createMockFromModule(
  "../../repositories/roomRepository/implementations/RedisRoomRepository"
);

const createRoomUseCase = new CreateRoomUsecase(roomRepository);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("CreateRoomUseCase unit tests", () => {
  it("should create a room", async () => {
    roomRepository.save = jest.fn();
    const createdRoom = await createRoomUseCase.execute({
      participant: { id: "12", name: "participant" },
    });

    expect(createdRoom).toBeInstanceOf(Room);
    expect(JSON.parse(JSON.stringify(createdRoom))).toEqual({
      hidden: true,
      id: expect.any(String),
      participants: [{ id: "12", name: "participant", vote: null }],
    });
    expect(roomRepository.save).toHaveBeenCalledWith(createdRoom);
  });
});
