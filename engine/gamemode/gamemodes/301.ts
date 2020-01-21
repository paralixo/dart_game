import { Gamemode } from '../Gamemode';
import { GAMEMODE_301 } from './constants/modes';
import {Player} from '../../player/Player';
import {GameShot} from '../../game/GameShot';
import {GamePlayer} from '../../game/GamePlayer';
import {FIRST_SECTOR_TO_UNLOCK} from './constants/aroundTheWorld';
import {ON_START_SCORE_GAMEMODE_301} from './constants/301';

export class Gamemode301 extends Gamemode{
  public mode = GAMEMODE_301;

  initializeStatus(gamePlayers: GamePlayer[]): GamePlayer[] {
    for (const gamePlayer of gamePlayers) {
      gamePlayer.score = ON_START_SCORE_GAMEMODE_301;
    }
    return gamePlayers;
  }

  public handleShot(gamePlayer: GamePlayer, shot: GameShot): GamePlayer {
    const points: number = shot.sector * shot.multiplicator;
    const scoreAfterShot: number = gamePlayer.score - points;

    const isFinishing: boolean = scoreAfterShot === 0 && shot.multiplicator === 2;
    if (scoreAfterShot >= 2 || isFinishing) {
      gamePlayer.score = scoreAfterShot;
    }
    return gamePlayer;
  }

  didIWin(gamePlayer: GamePlayer): boolean {
    if (gamePlayer.score === 0) {
      return true;
    }
    return false;
  }

  getScoreTable(gamePlayers: GamePlayer[], players: Player[]): object[] {
    const numberOfPlayers: number = players.length;
    let table: object[] = [];

    for (const gamePlayer of gamePlayers) {
      const playerId: number = gamePlayer.playerId;
      const player: Player = players[playerId];

      table.push({
                   name: player.name,
                   score: gamePlayer.score,
                   rank: gamePlayer.rank
                 });
    }

    return table;
  }
}