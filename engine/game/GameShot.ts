import { IGameShot } from './interfaces/IGameShot';
import {ISectorMultiplicatorShot} from '../ISectorMultiplicatorShot';

export class GameShot implements IGameShot {
  id = '';
  gameId = 0;
  playerId = 0;
  multiplicator = 0;
  sector = 0;
  createdAt = new Date();

  constructor(gameId: number, playerId: number, userInput: ISectorMultiplicatorShot) {
    this.gameId = gameId;
    this.playerId = playerId;
    this.sector = userInput.sector;
    this.multiplicator = userInput.multiplicator;
  }
}