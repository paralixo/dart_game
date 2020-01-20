export interface IGameShot {
  id: number | string;
  gameId: number;
  playerId: number;
  multiplicator: number;
  sector: number;
  createdAt: Date;
}