export interface Room {
  id: string;
  hidden: boolean;
  participants: {
    id: string;
    name: string;
    vote: string | null;
  }[];
}
