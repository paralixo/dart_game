import { Gamemode } from '../Gamemode';
import { CRICKET } from './constants/modes';
import {Player} from '../../player/Player';
import {GameShot} from '../../game/GameShot';
import {GamePlayer} from '../../game/GamePlayer';

export class Cricket extends Gamemode{
  public mode = CRICKET;

  public handleShot(gamePlayer: GamePlayer, shot: GameShot): any {
    console.log("tralala")
  }
}