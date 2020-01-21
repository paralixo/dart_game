import {GameShot} from '../../game/GameShot';
import {GamePlayer} from '../../game/GamePlayer';
import {Player} from '../../player/Player';

export interface IGamemode {
  id: number;
  mode: string;
  name: string;
  currentPlayerId: null | string | number;
  status: string;
  createdAt: Date;

  handleShot(gamePlayer: GamePlayer, shot: GameShot): GamePlayer
  initializeStatus(gamePlayers: GamePlayer[]): GamePlayer[]
  didIWin(gamePlayer: GamePlayer): boolean
  getScoreTable(gamePlayers: GamePlayer[], players: Player[]): object[]
}