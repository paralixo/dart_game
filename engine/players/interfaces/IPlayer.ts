export interface IPlayer {
    id: number | string
    name: string
    email: string // Format email à valider
    gameWin: number
    gameLost: number
    createdAt: Date
}