import {IError} from './interfaces/IError';

export const PLAYERS_NOT_REMOVABLE_GAME_STARTED: IError = {
    error: '422 PLAYERS_NOT_REMOVABLE_GAME_STARTED',
    message: 'La partie a déjà commencé. Il est impossible de supprimer un joueur'
}