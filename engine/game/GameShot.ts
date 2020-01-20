import {IGameShot} from "./interfaces/IGameShot";

export class GameShot implements IGameShot {
    id = ''
    gameId = ''
    playerId = ''
    multiplicator = 1
    sector = 0
    createdAt = new Date()
}