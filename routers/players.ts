import express from 'express'
import {NotAcceptable} from '../errors/Server/NotAcceptable';
import Player from '../models/Player';

const router = express.Router()

router.get('/', async (
    request,
    response
) => {
    // TODO: max limit is 20
    const limit: number = +request.query.limit ? +request.query.limit : 10;
    const page: number = +request.query.page ? +request.query.page : 1;
    // TODO: limit sort choices
    const sort: string = request.query.sort ? request.query.sort : 'name';
    // TODO: juste ecrire reverse au lieu de reverse=true
    const sortOrder: number = request.query.reverse ? -1 : 1;
    const skippedResults = (page - 1) * limit;

    const players: any[] = await Player
        .find()
        .sort({[sort]: sortOrder})
        .skip(skippedResults)
        .limit(limit)
    response.format({
        html: () => {
            // TODO: retourner tableau
            response.send('tralalalala');
        },
        json: () => {
            response.send(players);
        }
    });
});

router.post('/', (
    request,
    response
) => {
    const name: string = request.body.name ? request.body.name : 'Unknown player';
    const email: string = request.body.email ? request.body.email : '';

    response.format({
        html: () => {
            // TODO: affichage du joueur crée
            response.redirect('/players/458712')
        },
        json: async () => {
            response
                .status(201)
                .send(await new Player({name, email}).save())
        }
    })
});

router.get('/new', async (
    request,
    response
) => {
    response.format({
        html: () => {
            // TODO: formulaire création player
            response.send('create your player')
        },
        json: () => {
            response.send(NotAcceptable)
        }
    })
});

router.get('/:id', async (
    request,
    response
) => {
    const playerId: number = +request.params.id ? +request.params.id : 1;

    response.format({
        html: () => {
            response.redirect(`/players/${playerId}/edit`)
        },
        json: async () => {
            response.send(await Player.findOne({id: playerId}))
        }
    })
});

router.get('/:id/edit', async (
    request,
    response
) => {
    const playerId: number = +request.params.id ? +request.params.id : 1;

    response.format({
        html: () => {
            // TODO: formulaire création player
            response.send('edit your player ' + playerId)
        },
        json: () => {
            response.send(NotAcceptable)
        }
    })
});

router.patch('/:id', async (
    request,
    response
) => {
    const playerId: number = +request.params.id ? +request.params.id : 1;
    const name: string = request.body.name ? request.body.name : undefined;
    const email: string = request.body.email ? request.body.email : undefined;

    response.format({
        html: () => {
            response.redirect('/players')
        },
        json: async () => {
            let updateValues: any = {};
            // TODO: gestion erreurs
            if (name !== undefined) {updateValues.name = name}
            if (email !== undefined) {updateValues.email = email}

            response.send(await Player.findOneAndUpdate(
                {id: playerId},
                updateValues,
                {new: true}
            ))
        }
    })
});

router.delete('/:id', async (
    request,
    response
) => {
    const playerId: number = +request.params.id ? +request.params.id : 1;
    // TODO: is in a started or ended game
    // and throw PlayerNotDeletable Error
    response.format({
        html: () => {
            response.redirect('/players');
        },
        json: async () => {
            // TODO: stop responding a body
            response.status(204).send(
                await Player.findOneAndDelete({id: playerId})
            )
        }
    })
});

export default router;