import { Gamemode } from '../Gamemode';
import { AROUND_THE_WORLD } from './constants/modes';
import {GameShot} from '../../game/GameShot';
import {Player} from '../../player/Player';
import {GamePlayer} from '../../game/GamePlayer';
import {IAroundTheWorldPlayerStatus} from './IAroundTheWorldPlayerStatus';
import {FIRST_SECTOR_TO_UNLOCK} from './constants/aroundTheWorld';

export class AroundTheWorld extends Gamemode{
  public mode = AROUND_THE_WORLD;
  public playersStatus: IAroundTheWorldPlayerStatus[] = []

  public initializeStatus(gamePlayers: GamePlayer[]): void {
    for (const gamePlayer of gamePlayers) {
      const playerStatus: IAroundTheWorldPlayerStatus = {
        playerId: gamePlayer.playerId,
        sectorToUnlock: FIRST_SECTOR_TO_UNLOCK
      };
      this.playersStatus.push(playerStatus)
    }
  }

  public handleShot(gamePlayer: GamePlayer, shot: GameShot): void {
    for (const playerStatus of this.playersStatus) {
      const samePlayer: boolean = playerStatus.playerId === gamePlayer.playerId;
      const goodSectorShooted: boolean = playerStatus.sectorToUnlock === shot.sector;

      if (samePlayer && goodSectorShooted) {
        playerStatus.sectorToUnlock++
      }
    }
  }

  public didIWin(playerId: number): boolean {
    const playerStatus: IAroundTheWorldPlayerStatus | undefined
        = this.playersStatus.find(playerStatus => playerStatus.playerId === playerId);
    if (playerStatus && playerStatus.sectorToUnlock === 21) {
      return true;
    }
    return false;
  }

  getScoreTable(gamePlayers: GamePlayer[], players: Player[]): object[] {
    const numberOfPlayers: number = players.length;
    let table: object[] = [];

    for (let i = 0; i < numberOfPlayers; i++) {
      const player = players[i];
      const gamePlayer = gamePlayers[i];

      table.push({
        name: player.name,
        sectorToUnlock: gamePlayer.score,
        rank: gamePlayer.rank
       })
    }

    return table;
  }
}