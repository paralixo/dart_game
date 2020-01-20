import readline from 'readline-sync'
import {Player} from "./engine/player/Player";
import {Gamemode} from "./engine/gamemode/Gamemode";
import {AroundTheWorld} from "./engine/gamemode/gamemodes/AroundTheWorld";
import {Cricket} from "./engine/gamemode/gamemodes/Cricket";
import {Gamemode301} from "./engine/gamemode/gamemodes/301";
import {GamePlayer} from "./engine/game/GamePlayer";

const askNumberToUser = (question: string): number => {
    let promptValue: string
    do {
        promptValue = readline.question(question)
    } while (isNaN(+promptValue) || promptValue === '')
    return +promptValue
}

const setGame = (): Gamemode => {
    const gamemode: number = askNumberToUser("Mode de jeu [0/1/2] : ")
    switch(gamemode) {
        case 0:
            return new AroundTheWorld()
        case 1:
            return new Cricket()
        case 2:
            return new Gamemode301()
        default:
            return new AroundTheWorld()
    }
}

const setPlayers = (): Player[] => {
    const numberOfPlayers: number = askNumberToUser("Nombre de joueurs : ")
    const players: Player[] = []
    for (let i = 0; i < numberOfPlayers; i++) {
        const name: string = readline.question(`Nom du joueur ${i} : `)
        const player: Player = new Player(i, name)
        players.push(player)
    }
    return players
}

const setGamePlayers = (players: Player[], game: Gamemode): GamePlayer[] => {
    const gamePlayers: GamePlayer[] = []
    for (let i = 0; i < players.length; i++) {
        const gamePlayer: GamePlayer = new GamePlayer(players[i].id, game.id)
        gamePlayers.push(gamePlayer)
    }
    return gamePlayers
}

const main = () => {
    const game: Gamemode = setGame()
    const players: Player[] = setPlayers()
    const gamePlayers: GamePlayer[] = setGamePlayers(players, game)
}

main()