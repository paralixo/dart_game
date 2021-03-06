import express from 'express';
import Player from '../models/Player';
import Game from '../models/Game';
import {NotAcceptable} from '../errors/Server/NotAcceptable';
import GameShot from '../models/GameShot';
import GamePlayer from '../models/GamePlayer';
import {PLAYERS_NOT_ADDABLE_GAME_STARTED} from '../errors/Player/PlayersNotAddableGameStarted';
import {PLAYERS_NOT_REMOVABLE_GAME_STARTED} from '../errors/Player/PlayersNotRemovableGameStated';
import {GAME_NOT_STARTED} from '../errors/Game/GameNotStarted';
import {GAME_ENDED} from '../errors/Game/GameEnded';
import {GAME_NOT_STARTABLE} from '../errors/Game/GameNotStartable';
import {GAME_NOT_EDITABLE} from '../errors/Game/GameNotEditable';
import {GAME_PLAYER_MISSING} from '../errors/Player/GamePlayerMissing';
import {IGamemode} from '../engine/gamemode/interfaces/IGamemode';
import {AroundTheWorld} from '../engine/gamemode/gamemodes/AroundTheWorld';
import {Gamemode} from '../engine/gamemode/Gamemode';
import {IGamePlayer} from '../engine/game/interfaces/IGamePlayer';
import {Gamemode301} from '../engine/gamemode/gamemodes/301';
import {Cricket} from '../engine/gamemode/gamemodes/Cricket';
import methodOverride from 'method-override';
import {IGameShot} from '../engine/game/interfaces/IGameShot';
import {IPlayer} from '../engine/player/interfaces/IPlayer';

const router = express.Router();
router.use(methodOverride('_method'));

router.get('/', async (
    request,
    response
) => {
    // TODO: max limit is 20
    const limit: number = +request.query.limit ? +request.query.limit : 10;
    const page: number = +request.query.page ? +request.query.page : 1;
    const sort: string = request.query.sort ? request.query.sort : 'name';
    // TODO: juste ecrire reverse au lieu de reverse=true
    const sortOrder: number = request.query.reverse ? -1 : 1;
    // TODO: limit the field
    const fStatus: string = request.query['f.status'];
    const skippedResults = (page - 1) * limit;

    // TODO: gerer fstatus
    const games: any[] = await Game
        .find()
        .sort({[sort]: sortOrder})
        .skip(skippedResults)
        .limit(limit);
    response.format({
                        html: () => {
                            // TODO: retourner tableau + bouton gestion joueurs
                            response.render('games/home', {games});
                        },
                        json: () => {
                            response.send(games);
                        }
                    });
});

router.get('/new', async (
    request,
    response
) => {
    response.format({
                        html: () => {
                            // TODO: send in json to make it work
                            response.render('games/new');
                        },
                        json: () => {
                            response.send(NotAcceptable);
                        }
                    });
});

router.post('/', async (
    request,
    response
) => {
    const name: string = request.body.name ? request.body.name : 'Unknown game';
    const mode: string = request.body.mode ? request.body.mode : 'around-the-world';

    const game = await new Game({name, mode}).save();
    response.format({
                        html: () => {
                            response.redirect(`/games/${game.id}`);
                        },
                        json: () => {
                            response.status(201).send(game);
                        }
                    });
});

router.get('/:id', async (
    request,
    response
) => {
    const gameId: number = +request.params.id ? +request.params.id : 1;
    const isIncludingGamePlayers: boolean = request.query.include === 'gamePlayers';

    let game: { [key: string]: any } = await Game.findOne({id: gameId}) as object;
    if (isIncludingGamePlayers) {
        game.gamePlayers = await GamePlayer.find({gameId});
    }

    response.format({
        html: async () => {
            const gamePlayers = await GamePlayer.find({gameId});
            const players = await Player.find(
                {
                    id: {
                        // @ts-ignore
                        $in: gamePlayers.map(gamePlayer => gamePlayer.playerId)
                    }
                }
            );

            const currentGamePlayer: any = gamePlayers.find(gamePlayer => gamePlayer.id === game.currentPlayerId);
            let current: any = {};
            if (currentGamePlayer) {
                const currentPlayer = players.find(player => player.id === currentGamePlayer.playerId);
                current = {gamePlayer: currentGamePlayer, player: currentPlayer};
            }

            let ranking: any[] = [];
            if (current.gamePlayer && current.gamePlayer.rank) {
                current = {};
                for (let gamePlayer of gamePlayers) {
                    ranking.push(gamePlayer)
                }
                ranking.sort((gpA, gpB) => {
                    return gpA.rank - gpB.rank
                })
            }


            const shots = await GameShot.find({gameId});
            response.render('games/show', {game, players, current, shots, ranking});
        },
        json: () => {
            response.send(game);
        }
    });
});

router.get('/:id/edit', (
    request,
    response
) => {
    const gameId: number = +request.params.id ? +request.params.id : 1;

    response.format({
                        html: () => {
                            // TODO: send in json to make it work and adapt for update
                            response.render('games/new');
                        },
                        json: () => {
                            response.send(NotAcceptable);
                        }
                    });
});

router.patch('/:id', async (
    request,
    response
) => {
    const gameId: number = +request.params.id ? +request.params.id : 1;
    const game: any = await Game.findOne({id: gameId});
    const status: string = request.body.status ? request.body.status : undefined;
    if (game.status !== 'draft') {
        if (status !== undefined) {
            response.send(GAME_NOT_STARTABLE);
        }
        response.send(GAME_NOT_EDITABLE);
    }

    const name: string = request.body.name ? request.body.name : undefined;
    const mode: string = request.body.mode ? request.body.mode : undefined;

    let updateValues: any = {};
    if (name !== undefined) {
        updateValues.name = name;
    }
    if (mode !== undefined) {
        updateValues.mode = mode;
    }
    if (status !== undefined) {
        const gamePlayers: any[] = await GamePlayer.find({gameId});
        if (gamePlayers.length >= 2) {
            updateValues.status = status;
            const gamemode: Gamemode = getGameMode(game.mode);
            generatingPlayerOrder(gamemode.initializeStatus(gamePlayers));
            let index: number = 0;
            for (const gamePlayer of gamePlayers) {
                await GamePlayer.updateOne({
                                               gameId: gamePlayer.gameId,
                                               playerId: gamePlayer.playerId
                                           }, gamePlayer);
                index++;
            }

            const currentPlayerId: number = gamePlayers.find(gamePlayer => gamePlayer.order === 1).id;
            await Game.updateOne(game, {currentPlayerId});
        } else {
            response.send(GAME_PLAYER_MISSING);
        }
    }

    const newGame: any = await Game.updateOne(
        {id: gameId},
        updateValues,
        {new: true}
    );

    response.format({
                        html: () => {
                            response.redirect(`/games/${gameId}`);
                        },
                        json: async () => {
                            response.status(200).send(newGame);
                        }
                    });
});

const getGameMode = (mode: string): Gamemode => {
    switch (mode) {
        case 'around-the-world':
            return new AroundTheWorld();
        case '301':
            return new Gamemode301();
        case 'cricket':
            return new Cricket();
        default:
            return new AroundTheWorld();
    }
};

const generatingPlayerOrder = (gamePlayers: IGamePlayer[]): IGamePlayer[] => {
    const min = 0;
    const max = gamePlayers.length;
    const firstPlayerIndex = Math.floor(Math.random() * (max - min) + min);
    [gamePlayers[min], gamePlayers[firstPlayerIndex]] = [gamePlayers[firstPlayerIndex], gamePlayers[min]];

    const offset: number = 1;
    for (let i = 0; i < max; i++) {
        gamePlayers[i].order = i + offset;
    }
    return gamePlayers;
};

router.delete('/:id', async (
    request,
    response
) => {
    const gameId: number = +request.params.id ? +request.params.id : 1;
    // TODO: verify game exists
    await Game.findOneAndDelete({id: gameId});
    response.format({
                        html: () => {
                            response.redirect('/games');
                        },
                        json: async () => {
                            response.status(204).send({});
                        }
                    });
});

router.get('/:id/players', async (
    request,
    response
) => {
    const gameId: number = +request.params.id ? +request.params.id : 1;
    const gamePlayers: any = await GamePlayer.find({gameId}).sort({playerId: 1});
    const players: any[] = [];
    for (const gamePlayer of gamePlayers) {
        players.push(await Player.findOne({id: gamePlayer.playerId}));
    }
    response.format({
                        html: async () => {
                            const unavailableGamePlayers: any[] = await GamePlayer.find({gameId});
                            const unavailablePlayersIds: number[] = unavailableGamePlayers.map(gamePlayer => gamePlayer.playerId);
                            const availablePlayers: any[] = await Player.find({id: {$not: {$in: unavailablePlayersIds}}});
                            response.render(`games/players`, {players, availablePlayers, gameId});
                        },
                        json: () => {
                            response.send(players);
                        },
                    });
});

router.post('/:id/players', async (
    request,
    response
) => {
    // TODO: (bonus) create inexistant players
    const gameId: number = +request.params.id ? +request.params.id : 1;
    const game: any = await Game.findOne({id: gameId});
    if (game.status !== 'draft') {
        response.format({
                            html: () => {
                                response.render('error', {error: PLAYERS_NOT_ADDABLE_GAME_STARTED});
                            },
                            json: () => {
                                response.send(PLAYERS_NOT_ADDABLE_GAME_STARTED);
                            }
                        });
        return;
    }

    // TODO: verify player exist
    const playersIds: number[] = request.body.players ? request.body.players.map(Number).filter((value: number) => !isNaN(value)) : [1];
    for (const playerId of playersIds) {
        await new GamePlayer({gameId, playerId}).save();
    }

    response.format({
                        html: () => {
                            response.redirect(`/games/${gameId}/players`);
                        },
                        json: () => {
                            response.status(204).send({});
                        },
                    });
});

router.delete('/:id/players', async (
    request,
    response
) => {
    const gameId: number = +request.params.id ? +request.params.id : 1;
    const game: any = await Game.findOne({id: gameId});
    if (game.status !== 'draft') {
        response.format({
                            html: () => {
                                response.render('error', {error: PLAYERS_NOT_REMOVABLE_GAME_STARTED});
                            },
                            json: () => {
                                response.send(PLAYERS_NOT_REMOVABLE_GAME_STARTED);
                            }
                        });
        return;
    }

    // TODO: verify player exist ?
    // TODO: faciliter cette ligne
    const playersIds: number[] = request.query.id ? Array.isArray(request.query.id) ? request.query.id.map(Number).filter((value: number) => !isNaN(value)) : [request.query.id] : [1];
    for (const playerId of playersIds) {
        await GamePlayer.deleteMany({gameId, playerId});
    }
    response.format({
                        html: () => {
                            response.redirect(`/games/${gameId}/players`);
                        },
                        json: () => {
                            response.status(204).send({});
                        },
                    });
});

router.post('/:id/shots', async (
    request,
    response
) => {
    const gameId: number = +request.params.id ? +request.params.id : 1;
    const game: any = await Game.findOne({id: gameId});
    const playerId: any = game.currentPlayerId;
    switch (game.status) {
        case 'draft':
            response.send(GAME_NOT_STARTED);
            break;
        case 'ended':
            response.send(GAME_ENDED);
            break;
        default:
            break;
    }

    let gamePlayer: any = await GamePlayer.findOne({
                                                       id: playerId,
                                                       gameId
                                                   }) as unknown as IGamePlayer;

    if (gamePlayer.rank) {
        response.send({error: 'NOT_PLAYABALE', message: 'Ce joueur a terminé la partie, il ne peut plus jouer'})
    }

    let multiplicator: number = +request.body.multiplicator ? +request.body.multiplicator : 1;
    let sector: number = +request.body.sector ? +request.body.sector : 1;

    if (+request.body.sector === 0 && +request.body.multiplicator === 0) {
        multiplicator = 0;
        sector = 0;
    }

    sector = sector > 20 ? 20 : sector;
    sector = sector < 0 ? 0 : sector;
    multiplicator = multiplicator > 2 && sector == 20 ? 2 : multiplicator > 3 ? 3 : multiplicator;
    multiplicator = multiplicator < 0 ? 0 : multiplicator;

    const lastShot: IGameShot = await new GameShot({
                                                       playerId,
                                                       gameId,
                                                       multiplicator,
                                                       sector
                                                   }).save() as unknown as IGameShot;

    gamePlayer.remainingShots--;
    // @ts-ignore
    gamePlayer = getGameMode(game.mode).handleShot(gamePlayer, lastShot);
    await GamePlayer.findOneAndUpdate(
        {id: gamePlayer.id},
        gamePlayer
    );

    let isGameOver: boolean = false;
    const isPlayerVictorious: boolean = getGameMode(game.mode).didIWin(gamePlayer);
    if (isPlayerVictorious) {
        const allCurrentRanks: any[] = await GamePlayer.find({gameId, rank: {$exists: true } }) as unknown as any[];
        let nextRank: number = Math.max(...allCurrentRanks.map(gamePlayer => gamePlayer.rank));
        gamePlayer.rank = nextRank === -Infinity ? 1 : nextRank + 1;
        await GamePlayer.findOneAndUpdate({_id: gamePlayer._id}, {rank: gamePlayer.rank});

        await turnNextPlayer(gamePlayer, gameId, game)

        let allGamePlayers: any[] = await GamePlayer.find({gameId});
        if (allCurrentRanks.length === allGamePlayers.length - 2) {
            isGameOver = true;
            let unrankedGamePlayer: any = allGamePlayers.find(gamePlayer => !gamePlayer.rank);
            unrankedGamePlayer.rank = gamePlayer.rank + 1;

            await GamePlayer.findOneAndUpdate(
                {id: unrankedGamePlayer.id},
                unrankedGamePlayer
            );
        }
    }

    if (gamePlayer.remainingShots <= 0 && !isPlayerVictorious) {
        await turnNextPlayer(gamePlayer, gameId, game)

        await GamePlayer.findOneAndUpdate({_id: gamePlayer._id}, {remainingShots: 3});
    }

    if (isGameOver) {
        await Game.findOneAndUpdate({id: gameId}, {status: 'ended'})
        let allGamePlayers: any[] = await GamePlayer.find({gameId});
        allGamePlayers.sort((gpA, gpB) => gpA.rank - gpB.rank)

        let index: number = 0;
        for (let gamePlayer of allGamePlayers) {
            let player: any = await Player.findOne({id: gamePlayer.playerId});
            if (index === 0) {
                await Player.findOneAndUpdate(
                    {id: gamePlayer.playerId},
                    {gameWin: player.gameWin + 1}
                )
            } else {
                await Player.findOneAndUpdate(
                    {id: gamePlayer.playerId},
                    {gameLost: player.gameLost + 1}
                )
            }
            index++;
        }
    }

    response.format({
                        html: () => {
                            response.redirect(`/games/${gameId}`);
                        },
                        json: () => {
                            response.status(204).send({});
                        },
                    });
});

// TODO: faire route facultative

async function turnNextPlayer(gamePlayer: any, gameId: number, game: any) {
    const numberOfPlayers: number = (await GamePlayer.find({gameId}) as any[]).length
    const nextOrder: number = nextPlayerOrder(gamePlayer.order, numberOfPlayers)
    let nextPlayer: any = await findNextPlayer(nextOrder, gamePlayer, gameId, numberOfPlayers);

    game.currentPlayerId = nextPlayer.id;
    await Game.findOneAndUpdate(
        {id: game.id},
        game
    );

    return false;
}

async function findNextPlayer(actualPlayerOrder: number ,gamePlayer: any, gameId: number, numberOfPlayers: number, iteration: number = 1) {
    let nextPlayer: any = await GamePlayer.findOne({gameId, order: actualPlayerOrder}) as any;

    if (nextPlayer.rank && iteration <= numberOfPlayers) {
        const nextOrder: number = nextPlayerOrder(actualPlayerOrder, numberOfPlayers)
        nextPlayer= await findNextPlayer(nextOrder, gamePlayer, gameId, numberOfPlayers, iteration + 1)
    }

    return nextPlayer
}

function nextPlayerOrder(actualOrder: number, numberOfPlayers: number): number {
    const nextOrder: number = actualOrder + 1;
    return nextOrder > numberOfPlayers ? 1 : nextOrder;
}

export default router;
