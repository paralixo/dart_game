import mongoose from "mongoose";
import autoIncrement from 'mongoose-auto-increment';

const gamePlayer: mongoose.Schema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    playerId: {
        type: Number,
        required: true
    },
    gameId: {
        type: Number,
        required: true
    },
    remainingShots:  {
        type: Number,
        required: true,
        default: 3
    },
    score:  {
        type: Number,
        required: true,
        default: 0
    },
    rank:  {
        type: Number
    },
    order:  {
        type: Number
    },
    createdAt:  {
        type: Date,
        required: true,
        default: new Date()
    }
});

autoIncrement.initialize(mongoose.connection)
gamePlayer.plugin(autoIncrement.plugin, {
    model: 'gamePlayer',
    field: 'id',
    startAt: 1
})
export default mongoose.model('gamePlayer', gamePlayer);
