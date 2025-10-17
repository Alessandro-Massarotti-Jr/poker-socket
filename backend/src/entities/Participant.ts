import { Name } from "./valueObjects/Name";
import { Vote } from "./valueObjects/Vote";

type props = {
  id: string;
  name: Name;
};

export class Participant {
  public readonly id: string;
  public name: Name;
  public vote: Vote | null = null;

  private constructor(props: props) {
    this.id = props.id;
    this.name = props.name;
  }

  public static create(props: props): Participant {
    return new Participant(props);
  }

  public clearVote() {
    this.vote = null;
  }

  public setVote(vote: Vote) {
    this.vote = vote;
  }
}
