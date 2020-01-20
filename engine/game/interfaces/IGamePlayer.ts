export interface IGamePlayer {
  id?: number | string;
  playerId: number;
  gameId: number;
  remainingShots: number | null;
  score: number;
  rank: null | number;
  order: number;
  createdAt: Date;
}