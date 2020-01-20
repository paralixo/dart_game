export interface IGamemode {
    id: number | string
    mode: string
    name: string
    currentPlayerId: null | string | number
    status: string
    createdAt: Date
}