import {IError} from '../interfaces/IError';

export const GAME_NOT_STARTABLE: IError = {
    error: '422 GAME_NOT_STARTABLE',
    message: 'Impossible de lancer la partie. Elle est déjà lancée ou terminée.'
}