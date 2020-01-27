import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment"

const player: mongoose.Schema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    currentPlayerId: {
        type: Number
    },
    gameWin:  {
        type: Number,
        required: true,
        default: 0
    },
    gameLost:  {
        type: Number,
        required: true,
        default: 0
    },
    createdAt:  {
        type: Date,
        required: true,
        default: new Date()
    }
});

autoIncrement.initialize(mongoose.connection)
player.plugin(autoIncrement.plugin, {
    model: 'player',
    field: 'id',
    startAt: 1
})
export default mongoose.model('player', player);
