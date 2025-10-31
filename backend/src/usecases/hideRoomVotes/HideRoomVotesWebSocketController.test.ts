import { Room } from "../../entities/Room";
import { InvalidParamsError } from "../../errors/InvalidParamsError";
import { HideRoomVotesUseCase } from "./HideRoomVotesUseCase";
import { HideRoomVotesWebSocketController } from "./HideRoomVotesWebSocketController";

const hideRoomVotesUseCase: HideRoomVotesUseCase = jest.createMockFromModule(
  "./HideRoomVotesUseCase"
);

const hideRoomVotesWebSocketController = new HideRoomVotesWebSocketController(
  hideRoomVotesUseCase
);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("HideRoomVotesWebSocketController unit tests", () => {
  it("should emit a event for room votes hidden", async () => {
    const mockSocket: any = {
      join: jest.fn(),
      emit: jest.fn(),
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
      id: "12",
    };
    const sampleRoom = Room.create({ id: "1234" });
    hideRoomVotesUseCase.execute = jest.fn().mockResolvedValue(sampleRoom);

    await hideRoomVotesWebSocketController.handle(mockSocket, {
      roomId: "1234",
    });

    expect(hideRoomVotesUseCase.execute).toHaveBeenCalledWith({
      participantId: "12",
      roomId: "1234",
    });

    expect(mockSocket.emit).toHaveBeenCalledWith("room:votesHidden", {
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
    hideRoomVotesUseCase.execute = jest.fn().mockResolvedValue(sampleRoom);

    await expect(
      hideRoomVotesWebSocketController.handle(mockSocket, {})
    ).rejects.toThrow(InvalidParamsError);

    expect(hideRoomVotesUseCase.execute).not.toHaveBeenCalled();
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});
