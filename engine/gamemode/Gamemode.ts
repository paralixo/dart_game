import {IGamemode} from "./interfaces/IGamemode";
import {DRAFT} from "./constants/gameStatus";
import {EMPTY_STRING} from "../constants/utils";

export abstract class Gamemode implements IGamemode{
    public id = 0
    public mode = EMPTY_STRING
    public name = "Partie"
    public currentPlayerId = null
    public status = DRAFT
    public createdAt = new Date()
}