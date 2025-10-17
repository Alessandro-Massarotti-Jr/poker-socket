export type JoinRoomDTO = {
  roomId: string;
  participant: {
    id: string;
    name: string;
  };
};
