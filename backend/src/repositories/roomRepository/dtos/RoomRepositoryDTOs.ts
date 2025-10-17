import { Room } from "../../../entities/Room";

export type FindDTO = {
  id: string;
};
export type FindReturnDTO = Room | null;

export type SaveDTO = Room;
export type SaveReturnDTO = void;

export type DeleteDTO = { id: string };
export type DeleteReturnDTO = void;
