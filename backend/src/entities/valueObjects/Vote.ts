import { ValueObject } from "./ValueObject";

export class Vote extends ValueObject<string> {
  constructor(vote: string) {
    {
      super(vote);
    }
  }
}
