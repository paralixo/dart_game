import { IGamePlayer } from './interfaces/IGamePlayer';
import {NUMBER_OF_SHOTS_IN_A_TURN} from '../constants/utils';

export class GamePlayer implements IGamePlayer {
  public playerId = 0;
  public gameId = 0;
  public remainingShots = NUMBER_OF_SHOTS_IN_A_TURN;
  public score = 0;
  public rank = 0;
  public order = 0;
  public createdAt = new Date();

  constructor(playerId: number, gameId: number) {
    this.playerId = playerId;
    this.gameId = gameId;
  }

  refillShots(): void {
    this.remainingShots = NUMBER_OF_SHOTS_IN_A_TURN;
  }
}