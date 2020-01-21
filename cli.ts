import readline from 'readline-sync';
import {Player} from './engine/player/Player';
import {Gamemode} from './engine/gamemode/Gamemode';
import {AroundTheWorld} from './engine/gamemode/gamemodes/AroundTheWorld';
import {Cricket} from './engine/gamemode/gamemodes/Cricket';
import {Gamemode301} from './engine/gamemode/gamemodes/301';
import {GamePlayer} from './engine/game/GamePlayer';
import {GameShot} from './engine/game/GameShot';
import {ISectorMultiplicatorShot} from './engine/ISectorMultiplicatorShot';
import {MINIMUM_NUMBER_OF_PLAYERS, NUMBER_OF_SHOTS_IN_A_TURN} from './engine/constants/utils';

const askNumberToUser = (question: string): number => {
    let promptValue: string;
    do {
        promptValue = readline.question(question);
    } while (isNaN(+promptValue) || promptValue === '');
    return +promptValue;
};

const askShotToUser = (question: string): ISectorMultiplicatorShot => {
    const regex: RegExp = /^([1-3]\*)?([1-9]|1[0-9]|20|25)$/;
    let promptValue: string;
    do {
        promptValue = readline.question(question);
    } while (!regex.test(promptValue));

    const separatedPrompt: string[] = promptValue.split('*');
    let sector: number;
    let multiplicator: number = 1;
    if (separatedPrompt.length === 1) {
        sector = +separatedPrompt[0];
    } else {
        multiplicator = +separatedPrompt[0];
        sector = +separatedPrompt[1];
    }
    return {sector, multiplicator};
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
    let numberOfPlayers: number = 0;
    do {
        numberOfPlayers = askNumberToUser('Nombre de joueurs : ');
    } while (numberOfPlayers < MINIMUM_NUMBER_OF_PLAYERS);
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
    [gamePlayers[min], gamePlayers[firstPlayerIndex]] = [gamePlayers[firstPlayerIndex], gamePlayers[min]];

    const offset: number = 1;
    for (let i = 0; i < max; i++) {
        gamePlayers[i].order = i + offset;
    }
    return gamePlayers;
};

const isGameOver = (gamePlayers: GamePlayer[]): boolean => {
  const numberOfRemainingPlayers: any = gamePlayers
      .filter(gamePlayer => gamePlayer.rank === 0)
      .length;
  return numberOfRemainingPlayers <= 1 ? true : false;
};

const getNextMainLoopIndex = (index: number, numberOfPlayers: number): number => {
  index++;
  if (index >= numberOfPlayers) {
    index = 0;
  }
  return index;
};

const main = (): void => {
    const game: Gamemode = setGame();
    const players: Player[] = setPlayers();
    const gamePlayers: GamePlayer[] = setGamePlayers(players, game);
    game.initializeStatus(gamePlayers);

    let index = 0;
    let rankAvailable = 1;
    while (!isGameOver(gamePlayers)) {
        // get useful data
        const gamePlayer: GamePlayer = gamePlayers[index];
        const playerId: number = gamePlayer.playerId;
        const player: Player = players[playerId];

        // pass turn is player already won
        if (gamePlayer.rank !== 0) {
            index = getNextMainLoopIndex(index, players.length);
            continue;
        }

        console.log(`Tour de ${player.name}`);
        do {
            // handle shot
            const userInput: ISectorMultiplicatorShot = askShotToUser(`Il te reste ${gamePlayer.remainingShots} coups.\nScore: `);
            gamePlayer.remainingShots--;
            const shot = new GameShot(game.id, player.id, userInput);
            game.handleShot(gamePlayer, shot);

            // did I win ?
            const didIWin: boolean = game.didIWin(playerId);
            if (didIWin) {
                gamePlayer.rank = rankAvailable;
                rankAvailable++;
                console.log(`Bravo ${player.name}, tu as gagné !\nPlace: ${gamePlayer.rank}`);
                break;
            }
        } while (gamePlayer.remainingShots !== 0);
        gamePlayer.refillShots();

        // debug
        for (const i in game) {
            if (i == "playersStatus") {
                console.log("Debug :");
                // @ts-ignore
                console.log(game[i]);
                console.log("---\n");
            }
        }

        console.table(game.getScoreTable(gamePlayers, players));
        index = getNextMainLoopIndex(index, players.length);
    }
    // TODO: set rank of the last player
    console.log("Le jeu est terminé");
};

main();