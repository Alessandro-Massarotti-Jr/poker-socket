import { Room } from "../../entities/Room";
import { InvalidParamsError } from "../../errors/InvalidParamsError";
import { ClearRoomVotesUseCase } from "./ClearRoomVotesUseCase";
import { ClearRoomVotesWebSocketController } from "./ClearRoomVotesWebSocketController";

const clearRoomVotesUseCase: ClearRoomVotesUseCase = jest.createMockFromModule(
  "./ClearRoomVotesUseCase"
);

const clearRoomVotesWebSocketController = new ClearRoomVotesWebSocketController(
  clearRoomVotesUseCase
);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("ClearRoomVotesWebSocketController unit tests", () => {
  it("should emit a event for cleared room votes", async () => {
    const mockSocket: any = {
      join: jest.fn(),
      emit: jest.fn(),
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
      id: "12",
    };
    const sampleRoom = Room.create({ id: "1234" });
    clearRoomVotesUseCase.execute = jest.fn().mockResolvedValue(sampleRoom);

    await clearRoomVotesWebSocketController.handle(mockSocket, {
      roomId: "test",
    });

    expect(clearRoomVotesUseCase.execute).toHaveBeenCalledWith({
      participantId: "12",
      roomId: "test",
    });

    expect(mockSocket.emit).toHaveBeenCalledWith("room:clearedVotes", {
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
    clearRoomVotesUseCase.execute = jest.fn().mockResolvedValue(sampleRoom);

    await expect(
      clearRoomVotesWebSocketController.handle(mockSocket, {})
    ).rejects.toThrow(InvalidParamsError);

    expect(clearRoomVotesUseCase.execute).not.toHaveBeenCalled();
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});
