import { CustomError } from "./CustomError";

export class InvalidParamsError extends CustomError {
  constructor({ message }: { message: string }) {
    super({
      message: `Invalid params informed: ${message}`,
      severity: "low",
      ignorable: true,
    });
  }
}
