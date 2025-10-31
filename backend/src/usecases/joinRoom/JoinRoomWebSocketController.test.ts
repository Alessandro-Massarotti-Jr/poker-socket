import { Room } from "../../entities/Room";
import { InvalidParamsError } from "../../errors/InvalidParamsError";
import { JoinRoomUseCase } from "./JoinRoomUseCase";
import { JoinRoomWebSocketController } from "./JoinRoomWebSocketController";

const joinRoomUseCase: JoinRoomUseCase =
  jest.createMockFromModule("./JoinRoomUseCase");

const joinRoomWebSocketController = new JoinRoomWebSocketController(
  joinRoomUseCase
);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("JoinRoomWebSocketController unit tests", () => {
  it("should emit a event for joined room  ", async () => {
    const mockSocket: any = {
      join: jest.fn(),
      emit: jest.fn(),
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
      id: "12",
    };
    const sampleRoom = Room.create({ id: "1234" });
    joinRoomUseCase.execute = jest.fn().mockResolvedValue(sampleRoom);

    await joinRoomWebSocketController.handle(mockSocket, {
      participantName: "test",
      roomId: "1234",
    });

    expect(joinRoomUseCase.execute).toHaveBeenCalledWith({
      roomId: "1234",
      participant: { id: "12", name: "test" },
    });

    expect(mockSocket.join).toHaveBeenCalledWith("1234");
    expect(mockSocket.emit).toHaveBeenCalledWith("room:joined", {
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
    joinRoomUseCase.execute = jest.fn().mockResolvedValue(sampleRoom);

    await expect(
      joinRoomWebSocketController.handle(mockSocket, {})
    ).rejects.toThrow(InvalidParamsError);

    expect(joinRoomUseCase.execute).not.toHaveBeenCalled();

    expect(mockSocket.join).not.toHaveBeenCalled();
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});
