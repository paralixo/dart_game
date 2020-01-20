import { Gamemode } from '../Gamemode';
import { AROUND_THE_WORLD } from './constants/modes';
import {GameShot} from '../../game/GameShot';
import {Player} from '../../player/Player';
import {GamePlayer} from '../../game/GamePlayer';

export class AroundTheWorld extends Gamemode{
  public mode = AROUND_THE_WORLD;

  public handleShot(gamePlayer: GamePlayer, shot: GameShot): any {
    console.log("tralala")
  }
}