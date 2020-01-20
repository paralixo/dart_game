import {GameShot} from '../../game/GameShot';
import {GamePlayer} from '../../game/GamePlayer';

export interface IGamemode {
  id: number;
  mode: string;
  name: string;
  currentPlayerId: null | string | number;
  status: string;
  createdAt: Date;

  handleShot(gamePlayer: GamePlayer, shot: GameShot): any;
}