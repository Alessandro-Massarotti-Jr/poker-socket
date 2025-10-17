export type ErrorProps = {
  message: string;
  severity?: "low" | "medium" | "high";
  errorCode?: string;
  httpStatusCode?: number;
  ignorable?: boolean;
  socketEvent?: string;
};

export class CustomError extends Error {
  public readonly message: string;
  public readonly severity: "low" | "medium" | "high";
  public readonly errorCode?: string | null;
  public readonly httpStatusCode: number;
  public readonly socketEvent: string | null;
  public readonly ignorable: boolean;

  constructor(props: ErrorProps) {
    super(props.message);
    this.message = props.message;
    this.severity = props.severity ?? "high";
    this.errorCode = props.errorCode ?? null;
    this.socketEvent = props.socketEvent ?? "aplication:error";
    this.httpStatusCode = props.httpStatusCode ?? 500;
    this.ignorable = props.ignorable ?? false;
  }

  public toJSON() {
    return {
      message: this.message,
      errorCode: this.errorCode,
    };
  }
}
