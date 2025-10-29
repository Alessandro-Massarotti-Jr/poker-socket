import { CustomError } from "./CustomError";

export class RoomNotFoundError extends CustomError {
  constructor() {
    super({
      message: `Room not found for provided id`,
      severity: "low",
      ignorable: false,
    });
  }
}
