import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment"

const gameShot: mongoose.Schema = new mongoose.Schema({
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
    multiplicator:  {
        type: Number,
        required: true
    },
    sector:  {
        type: Number,
        required: true
    },
    createdAt:  {
        type: Date,
        required: true,
        default: new Date()
    }
});

autoIncrement.initialize(mongoose.connection)
gameShot.plugin(autoIncrement.plugin, {
    model: 'gameShot',
    field: 'id',
    startAt: 1
})
export default mongoose.model('gameShot', gameShot);
