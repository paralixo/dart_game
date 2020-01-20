import readline from 'readline-sync';
import { Player } from './engine/player/Player';
import { Gamemode } from './engine/gamemode/Gamemode';
import { AroundTheWorld } from './engine/gamemode/gamemodes/AroundTheWorld';
import { Cricket } from './engine/gamemode/gamemodes/Cricket';
import { Gamemode301 } from './engine/gamemode/gamemodes/301';
import { GamePlayer } from './engine/game/GamePlayer';
import {GameShot} from './engine/game/GameShot';
import {ISectorMultiplicatorShot} from './engine/ISectorMultiplicatorShot';

const askNumberToUser = (question: string): number => {
  let promptValue: string;
  do {
    promptValue = readline.question(question);
  } while (isNaN(+promptValue) || promptValue === '');
  return +promptValue;
};

const askShotToUser = (question: string): ISectorMultiplicatorShot => {
  const regex: RegExp = /^([1-3]\*)?[0-9]+$/;
  let promptValue: string;
  do {
    promptValue = readline.question(question);
  } while (!regex.test(promptValue));

  const separatedPrompt: string[] = promptValue.split('*');
  let sector: number;
  let multiplicator: number = 1;
  if (separatedPrompt.length === 1) {
    sector = +separatedPrompt[0]
  } else {
    multiplicator = +separatedPrompt[0]
    sector = +separatedPrompt[1]
  }
  return {sector, multiplicator}
};

const setGame = (): Gamemode => {
  const gamemode: number = askNumberToUser('Mode de jeu [0/1/2] : ');
  switch (gamemode) {
    case 0:
      return new AroundTheWorld();
    case 1:
      return new Cricket();
    case 2:
      return new Gamemode301();
    default:
      return new AroundTheWorld();
  }
};

const setPlayers = (): Player[] => {
  const numberOfPlayers: number = askNumberToUser('Nombre de joueurs : ');
  const players: Player[] = [];
  for (let i = 0; i < numberOfPlayers; i++) {
    const name: string = readline.question(`Nom du joueur ${i} : `);
    const player: Player = new Player(i, name);
    players.push(player);
  }
  return players;
};

const setGamePlayers = (players: Player[], game: Gamemode): GamePlayer[] => {
  const gamePlayers: GamePlayer[] = [];
  for (let i = 0; i < players.length; i++) {
    const gamePlayer: GamePlayer = new GamePlayer(players[i].id, game.id);
    gamePlayers.push(gamePlayer);
  }
  const inOrderGamePlayers: GamePlayer[] = generatingPlayerOrder(gamePlayers);
  return inOrderGamePlayers;
};

const generatingPlayerOrder = (gamePlayers: GamePlayer[]): GamePlayer[] => {
  const min = 0;
  const max = gamePlayers.length;
  const firstPlayerIndex = Math.floor(Math.random() * (max - min) + min);
  [gamePlayers[min], gamePlayers[firstPlayerIndex]] = [gamePlayers[firstPlayerIndex], gamePlayers[min]]

  const offset: number = 1;
  for (let i = 0; i < max; i++) {
    gamePlayers[i].order = i + offset;
  }
  return gamePlayers;
}

const main = (): void => {
  const game: Gamemode = setGame();
  const players: Player[] = setPlayers();
  const gamePlayers: GamePlayer[] = setGamePlayers(players, game);

  let isGameOver = false;
  let index = 0;
  while (!isGameOver) {
    const gamePlayer: GamePlayer = gamePlayers[index];
    const playerId: number = gamePlayer.playerId;
    const player: Player = players[playerId];

    const userInput: ISectorMultiplicatorShot = askShotToUser(`Tour de ${player.name} : `);
    const shot = new GameShot(game.id, player.id, userInput);
    game.handleShot(gamePlayer, shot);

    index++;
    if(index >= players.length) {
      index = 0;
    }
  }
};

main();