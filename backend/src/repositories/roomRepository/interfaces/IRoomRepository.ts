import {
  DeleteDTO,
  DeleteReturnDTO,
  FindDTO,
  FindReturnDTO,
  SaveDTO,
  SaveReturnDTO,
} from "../dtos/RoomRepositoryDTOs";

export interface IRoomRepository {
  find(data: FindDTO): Promise<FindReturnDTO>;
  save(data: SaveDTO): Promise<SaveReturnDTO>;
  delete(data: DeleteDTO): Promise<DeleteReturnDTO>;
}
