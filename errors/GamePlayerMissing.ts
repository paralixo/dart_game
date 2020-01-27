import {IError} from './interfaces/IError';

export const GAME_PLAYER_MISSING: IError = {
    error: '422 GAME_PLAYER_MISSING',
    message: 'Impossible de lancer une partie avec le nombre de joueurs actuels.'
}