import {Gamemode} from '../Gamemode';
import {CRICKET} from './constants/modes';
import {Player} from '../../player/Player';
import {GameShot} from '../../game/GameShot';
import {GamePlayer} from '../../game/GamePlayer';
import {IPlayerSectorMap} from './interfaces/IPlayerSectorMap';
import {ON_START_SCORE_GAMEMODE_301} from './constants/301';
import {CRICKET_SECTORS} from './constants/cricket';

export class Cricket extends Gamemode {
    public mode = CRICKET;
    public playersSectorsMap: IPlayerSectorMap[] = [];

    initializeStatus(gamePlayers: GamePlayer[]): GamePlayer[] {
        for (const gamePlayer of gamePlayers) {
            gamePlayer.score = 0;
            for (const sector of CRICKET_SECTORS) {
                this.playersSectorsMap.push({
                                                playerId: gamePlayer.playerId,
                                                sector,
                                                shooted: 0,
                                                closedBy: -1
                                            });
            }
        }
        return gamePlayers;
    }

    public handleShot(gamePlayer: GamePlayer, shot: GameShot): GamePlayer {
        const playerId: number = gamePlayer.playerId;
        const isShotOneOfCricketSections: boolean = CRICKET_SECTORS.includes(shot.sector);

        if (isShotOneOfCricketSections) {
            const playerSectorMap: IPlayerSectorMap | undefined = this.playersSectorsMap
                .find(map => map.playerId === playerId && map.sector === shot.sector);
            if (playerSectorMap) {
                playerSectorMap.shooted++;

                const isSectorClosedByMeOrOpen: IPlayerSectorMap | undefined = this.playersSectorsMap
                    .find(map => map.sector === shot.sector && (map.closedBy === playerId || map.closedBy === -1));
                if (isSectorClosedByMeOrOpen) {
                  if(playerSectorMap.shooted >= 3) {
                    playerSectorMap.closedBy = playerId
                  }
                  // TODO: no points if closed by all players
                  gamePlayer.score += shot.sector * shot.multiplicator;
                }
            }
        }
        console.log(this.playersSectorsMap)
        return gamePlayer;
    }

    didIWin(gamePlayer: GamePlayer): boolean {
        return false;
    }

    getScoreTable(gamePlayers: GamePlayer[], players: Player[]): object[] {
        return [{test: "test"}, {test: "bison"}, {test: "caribou"}];
    }
}