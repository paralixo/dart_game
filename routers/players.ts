import express from 'express'
import {NotAcceptable} from '../errors/Server/NotAcceptable';
import Player from '../models/Player';
import methodOverride from 'method-override'

const router = express.Router()
router.use(methodOverride('_method'))

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
            response.render('players/home', {players})
        },
        json: () => {
            response.send(players);
        }
    });
});

router.post('/', async (
    request,
    response
) => {
    const name: string = request.body.name ? request.body.name : 'Unknown player';
    const email: string = request.body.email ? request.body.email : '';

    const player = await new Player({name, email}).save();
    response.format({
        html: () => {
            response.redirect(`/players/${player.id}`)
        },
        json: () => {
            response
                .status(201)
                .send(player);
        }
    })
});

router.get('/new', async (
    request,
    response
) => {
    response.format({
        html: () => {
            const player = {}
            const title = 'Créer un jouer'
            const methodOverride = ""
            response.render('players/new', {player, title, methodOverride});
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
        html: async () => {
            const player = await Player.findOne({id: playerId});
            const title: string = 'Mettre à jour le joueur'
            const methodOverride: string = `/${playerId}?_method=PATCH`
            response.render('players/new', {player, title, methodOverride});
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

    let updateValues: any = {};
    // TODO: gestion erreurs
    if (name !== undefined) {updateValues.name = name}
    if (email !== undefined) {updateValues.email = email}

    const playerUpdate: any = await Player.findOneAndUpdate(
        {id: playerId},
        updateValues,
        {new: true}
    )
    response.format({
        html: () => {
            response.redirect('/players')
        },
        json: async () => {
            response.send(playerUpdate)
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
    const deletedPlayer: any = await Player.findOneAndDelete({id: playerId})
    response.format({
        html: () => {
            response.redirect('/players');
        },
        json: async () => {
            // TODO: stop responding a body
            response.status(204).send(deletedPlayer)
        }
    })
});

export default router;