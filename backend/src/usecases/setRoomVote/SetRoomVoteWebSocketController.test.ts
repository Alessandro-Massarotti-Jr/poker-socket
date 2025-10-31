import { Room } from "../../entities/Room";
import { InvalidParamsError } from "../../errors/InvalidParamsError";
import { SetRoomVoteUseCase } from "./SetRoomVoteUseCase";
import { SetRoomVoteWebSocketController } from "./SetRoomVoteWebSocketController";

const setRoomVoteUseCase: SetRoomVoteUseCase = jest.createMockFromModule(
  "./SetRoomVoteUseCase"
);

const setRoomVoteWebSocketController = new SetRoomVoteWebSocketController(
  setRoomVoteUseCase
);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("SetRoomVoteWebSocketController unit tests", () => {
  it("should emit a event for room voted", async () => {
    const mockSocket: any = {
      join: jest.fn(),
      emit: jest.fn(),
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
      id: "12",
    };
    const sampleRoom = Room.create({ id: "1234" });
    setRoomVoteUseCase.execute = jest.fn().mockResolvedValue(sampleRoom);

    await setRoomVoteWebSocketController.handle(mockSocket, {
      roomId: "1234",
      vote: "5",
    });

    expect(setRoomVoteUseCase.execute).toHaveBeenCalledWith({
      participantId: "12",
      roomId: "1234",
      vote: "5",
    });

    expect(mockSocket.emit).toHaveBeenCalledWith("room:voted", {
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
    setRoomVoteUseCase.execute = jest.fn().mockResolvedValue(sampleRoom);

    await expect(
      setRoomVoteWebSocketController.handle(mockSocket, {})
    ).rejects.toThrow(InvalidParamsError);

    expect(setRoomVoteUseCase.execute).not.toHaveBeenCalled();

    expect(mockSocket.join).not.toHaveBeenCalled();
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});
