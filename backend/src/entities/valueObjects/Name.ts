import { ValueObject } from "./ValueObject";

export class Name extends ValueObject<string> {
  constructor(name: string) {
    {
      super(name);
    }
  }
}
