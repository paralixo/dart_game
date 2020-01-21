import { Gamemode } from '../Gamemode';
import { GAMEMODE_301 } from './constants/modes';
import {Player} from '../../player/Player';
import {GameShot} from '../../game/GameShot';
import {GamePlayer} from '../../game/GamePlayer';

export class Gamemode301 extends Gamemode{
  public mode = GAMEMODE_301;

  public handleShot(gamePlayer: GamePlayer, shot: GameShot): any {
    console.log("tralala")
  }

  initializeStatus(gamePlayers: GamePlayer[]): void {
  }

  didIWin(playerId: number): boolean {
    return false;
  }

  getScoreTable(gamePlayers: GamePlayer[], players: Player[]): object[] {
    return [];
  }
}