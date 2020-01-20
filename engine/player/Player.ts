import {IPlayer} from "./interfaces/IPlayer";
import {EMPTY_STRING} from "../constants/utils";

export class Player implements IPlayer {
    public id = 0
    public name = EMPTY_STRING
    public email = EMPTY_STRING
    public gameWin = 0
    public gameLost = 0
    public createdAt = new Date()

    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }
}