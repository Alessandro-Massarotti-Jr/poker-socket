import { Room } from "../../entities/Room";
import { InvalidParamsError } from "../../errors/InvalidParamsError";
import { ShowRoomVotesUseCase } from "./ShowRoomVotesUseCase";
import { ShowRoomVotesWebSocketController } from "./ShowRoomVotesWebSocketController";

const showRoomVotesUseCase: ShowRoomVotesUseCase = jest.createMockFromModule(
  "./ShowRoomVotesUseCase"
);

const showRoomVotesWebSocketController = new ShowRoomVotesWebSocketController(
  showRoomVotesUseCase
);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("ShowRoomVotesWebSocketController unit tests", () => {
  it("should emit a event for room votes showed", async () => {
    const mockSocket: any = {
      join: jest.fn(),
      emit: jest.fn(),
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
      id: "12",
    };
    const sampleRoom = Room.create({ id: "1234" });
    showRoomVotesUseCase.execute = jest.fn().mockResolvedValue(sampleRoom);

    await showRoomVotesWebSocketController.handle(mockSocket, {
      roomId: "1234",
    });

    expect(showRoomVotesUseCase.execute).toHaveBeenCalledWith({
      participantId: "12",
      roomId: "1234",
    });

    expect(mockSocket.emit).toHaveBeenCalledWith("room:votesShowed", {
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
    showRoomVotesUseCase.execute = jest.fn().mockResolvedValue(sampleRoom);

    await expect(
      showRoomVotesWebSocketController.handle(mockSocket, {})
    ).rejects.toThrow(InvalidParamsError);

    expect(showRoomVotesUseCase.execute).not.toHaveBeenCalled();

    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});
