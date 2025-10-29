import { CustomError } from "./CustomError";

export class ParticipantNotInTheRoomError extends CustomError {
  constructor() {
    super({
      message: `Participant not found in this room`,
      severity: "medium",
      ignorable: false,
    });
  }
}
