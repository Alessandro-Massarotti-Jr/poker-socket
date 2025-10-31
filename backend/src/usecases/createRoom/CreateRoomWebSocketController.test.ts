import { Room } from "../../entities/Room";
import { InvalidParamsError } from "../../errors/InvalidParamsError";
import { CreateRoomUsecase } from "./CreateRoomUseCase";
import { CreateRoomWebSocketController } from "./CreateRoomWebSocketController";

const createRoomUseCase: CreateRoomUsecase = jest.createMockFromModule(
  "./CreateRoomUseCase"
);

const createRoomWebSocketController = new CreateRoomWebSocketController(
  createRoomUseCase
);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("CreateRoomWebSocketController unit tests", () => {
  it("should emit a event for created room  ", async () => {
    const mockSocket: any = {
      join: jest.fn(),
      emit: jest.fn(),
      id: "12",
    };
    const sampleRoom = Room.create({ id: "1234" });
    createRoomUseCase.execute = jest.fn().mockResolvedValue(sampleRoom);

    await createRoomWebSocketController.handle(mockSocket, {
      participantName: "test",
    });

    expect(createRoomUseCase.execute).toHaveBeenCalledWith({
      participant: { id: "12", name: "test" },
    });

    expect(mockSocket.join).toHaveBeenCalledWith("1234");
    expect(mockSocket.emit).toHaveBeenCalledWith("room:created", {
      room: sampleRoom,
    });
  });

  it("should throw validation errors", async () => {
    const mockSocket: any = {
      join: jest.fn(),
      emit: jest.fn(),
      id: "12",
    };
    const sampleRoom = Room.create({ id: "1234" });
    createRoomUseCase.execute = jest.fn().mockResolvedValue(sampleRoom);

    await expect(
      createRoomWebSocketController.handle(mockSocket, {})
    ).rejects.toThrow(InvalidParamsError);

    expect(createRoomUseCase.execute).not.toHaveBeenCalled();

    expect(mockSocket.join).not.toHaveBeenCalled();
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});
