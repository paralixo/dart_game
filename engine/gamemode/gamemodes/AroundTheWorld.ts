import {Gamemode} from '../Gamemode';
import {AROUND_THE_WORLD} from './constants/modes';
import {GameShot} from '../../game/GameShot';
import {Player} from '../../player/Player';
import {GamePlayer} from '../../game/GamePlayer';
import {IAroundTheWorldPlayerStatus} from './IAroundTheWorldPlayerStatus';
import {FIRST_SECTOR_TO_UNLOCK} from './constants/aroundTheWorld';

export class AroundTheWorld extends Gamemode {
    public mode = AROUND_THE_WORLD;

    public initializeStatus(gamePlayers: GamePlayer[]): GamePlayer[] {
        for (const gamePlayer of gamePlayers) {
            gamePlayer.score = FIRST_SECTOR_TO_UNLOCK;
        }
        return gamePlayers;
    }

    public handleShot(gamePlayer: GamePlayer, shot: GameShot): GamePlayer {
        if (shot.sector === gamePlayer.score) {
            gamePlayer.score++;
        }
        return gamePlayer;
    }

    public didIWin(gamePlayer: GamePlayer): boolean {
        if (gamePlayer.score === 21) {
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

            const scoreToPrint: string = gamePlayer.score === 21 ? "-" : gamePlayer.score.toString();
            table.push({
                   name: player.name,
                   nextSectorToUnlock: scoreToPrint,
                   rank: gamePlayer.rank
               });
        }

        return table;
    }
}