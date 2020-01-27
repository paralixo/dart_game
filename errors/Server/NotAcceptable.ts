import {IError} from '../interfaces/IError';

export const NotAcceptable: IError = {
    error: '406 NotAcceptable',
    message: 'Cette route n\'est pas prise en charge par l\'API'
}