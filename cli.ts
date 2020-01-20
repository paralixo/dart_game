import readline from 'readline-sync'

const askNumberToUser = (question: string): number => {
    let promptValue: string
    do {
        promptValue = readline.question(question)
    } while (isNaN(+promptValue))
    return +promptValue
}

const main = () => {
    const gamemode: number = askNumberToUser("Mode de jeu [0/1/2] : ")
    const numberOfPlayers: number = askNumberToUser("Nombre de joueurs : ")

    const playersNames: string[] = []
    for (let i = 0; i < numberOfPlayers; i++) {
        const name: string = readline.question(`Nom du joueur ${i} : `)
        playersNames.push(name)
    }

    console.log("gamemode value is : " + gamemode)
    console.log("numberOfPlayers value is : " + numberOfPlayers)
    console.log(playersNames)
}

main()