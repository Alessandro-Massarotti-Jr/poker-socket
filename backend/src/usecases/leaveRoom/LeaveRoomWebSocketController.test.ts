import { Room } from "../../entities/Room";
import { InvalidParamsError } from "../../errors/InvalidParamsError";
import { LeaveRoomUseCase } from "./LeaveRoomUseCase";
import { LeaveRoomWebSocketController } from "./LeaveRoomWebSocketController";

const leaveRoomUseCase: LeaveRoomUseCase =
  jest.createMockFromModule("./LeaveRoomUseCase");

const leaveRoomWebSocketController = new LeaveRoomWebSocketController(
  leaveRoomUseCase
);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("LeaveRoomWebSocketController unit tests", () => {
  it("should emit a event for room left", async () => {
    const mockSocket: any = {
      join: jest.fn(),
      emit: jest.fn(),
      leave: jest.fn(),
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
      rooms: new Map<any, any>([["1234", {}]]),
      id: "12",
    };
    const sampleRoom = Room.create({ id: "1234" });
    leaveRoomUseCase.execute = jest.fn().mockResolvedValue(sampleRoom);

    await leaveRoomWebSocketController.handle(mockSocket, {
      roomId: "1234",
    });

    expect(leaveRoomUseCase.execute).toHaveBeenCalledWith({
      roomId: "1234",
      participantId: "12",
    });

    expect(mockSocket.leave).toHaveBeenCalledWith("1234");
    expect(mockSocket.to).toHaveBeenCalledWith("1234");
  });

  it("should not emit a event for room left if usecase returns undefined", async () => {
    const mockSocket: any = {
      join: jest.fn(),
      emit: jest.fn(),
      leave: jest.fn(),
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
      rooms: new Map<any, any>([["1234", {}]]),
      id: "12",
    };
    const sampleRoom = Room.create({ id: "1234" });
    leaveRoomUseCase.execute = jest.fn().mockResolvedValue(undefined);

    await leaveRoomWebSocketController.handle(mockSocket, {
      roomId: "1234",
    });

    expect(leaveRoomUseCase.execute).toHaveBeenCalledWith({
      roomId: "1234",
      participantId: "12",
    });

    expect(mockSocket.leave).toHaveBeenCalledWith("1234");
    expect(mockSocket.to).not.toHaveBeenCalled();
  });

  it("should throw validation errors", async () => {
    const mockSocket: any = {
      join: jest.fn(),
      emit: jest.fn(),
      leave: jest.fn(),
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
      rooms: new Map<any, any>([["1234", {}]]),
      id: "12",
    };
    const sampleRoom = Room.create({ id: "1234" });
    leaveRoomUseCase.execute = jest.fn().mockResolvedValue(sampleRoom);

    await expect(
      leaveRoomWebSocketController.handle(mockSocket, {})
    ).rejects.toThrow(InvalidParamsError);

    expect(leaveRoomUseCase.execute).not.toHaveBeenCalled();

    expect(mockSocket.leave).not.toHaveBeenCalled();
    expect(mockSocket.to).not.toHaveBeenCalled();
  });
});
