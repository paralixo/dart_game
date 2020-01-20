import {IGamePlayer} from "./interfaces/IGamePlayer";

export class GamePlayer implements IGamePlayer {
    public playerId = 0
    public gameId = 0
    public remainingShots = 3
    public score = 0
    public rank =  null
    public order = null
    public createdAt = new Date()

    constructor(playerId: number, gameId: number) {
        this.playerId = playerId
        this.gameId = gameId
    }
}