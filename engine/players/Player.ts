import {IPlayer} from "./interfaces/IPlayer";
import {EMPTY_STRING} from "../constants/utils";

export class Player implements IPlayer {
    public id = EMPTY_STRING
    public name = EMPTY_STRING
    public email = EMPTY_STRING
    public gameWin = 0
    public gameLost = 0
    public createdAt = new Date()

    constructor(name: string) {
        this.name = name
    }
}