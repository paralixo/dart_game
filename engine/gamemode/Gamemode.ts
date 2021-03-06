import { IGamemode } from './interfaces/IGamemode';
import { DRAFT } from './constants/gameStatus';
import { EMPTY_STRING } from '../constants/utils';
import {Player} from '../player/Player';
import {GameShot} from '../game/GameShot';
import {GamePlayer} from '../game/GamePlayer';

export abstract class Gamemode implements IGamemode {
  public id = 0;
  public mode = EMPTY_STRING;
  public name = 'Partie';
  public currentPlayerId = null;
  public status = DRAFT;
  public createdAt = new Date();

  abstract initializeStatus(gamePlayers: GamePlayer[]): GamePlayer[]
  abstract handleShot(gamePlayer: GamePlayer, shot: GameShot): GamePlayer;
  abstract didIWin(gamePlayer: GamePlayer): boolean
  abstract getScoreTable(gamePlayers: GamePlayer[], players: Player[]): object[]
}