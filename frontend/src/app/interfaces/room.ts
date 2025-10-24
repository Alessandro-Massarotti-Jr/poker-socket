export interface Room {
  id: string;
  participants: {
    id: string;
    name: string;
    vote: string | null;
  }[];
}
