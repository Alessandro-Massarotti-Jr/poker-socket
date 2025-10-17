import { Participant } from "./Participant";

type props = {
  id: string;
};

export class Room {
  public readonly id: string;
  public readonly participants: Participant[] = [];

  private constructor(props: props) {
    this.id = props.id;
  }

  public static create(props: props): Room {
    return new Room(props);
  }

  public addParticipant(participant: Participant) {
    this.participants.push(participant);
  }

  public findParticipant(participantId: string): Participant | undefined {
    return this.participants.find(
      (participant) => participant.id === participantId
    );
  }

  public removeParticipant(participantId: string) {
    const participantIndex = this.participants.findIndex(
      (p) => p.id === participantId
    );
    if (participantIndex !== -1) {
      this.participants.splice(participantIndex, 1);
    }
  }

  public clearVotes() {
    this.participants.forEach((participant) => participant.clearVote());
  }

  public hasParticipants(): boolean {
    return this.participants.length > 0;
  }
}
