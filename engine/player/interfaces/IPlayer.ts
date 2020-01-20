export interface IPlayer {
  id: number;
  name: string;
  email: string; // Format email à valider
  gameWin: number;
  gameLost: number;
  createdAt: Date;
}