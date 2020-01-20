export interface IGamemode {
    id: number
    mode: string
    name: string
    currentPlayerId: null | string | number
    status: string
    createdAt: Date
}