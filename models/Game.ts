import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment"

const game: mongoose.Schema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    mode: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    currentPlayerId: {
        type: Number,
    },
    status:  {
        type: String,
        required: true,
        default: 'draft'
    },
    createdAt:  {
        type: Date,
        required: true,
        default: new Date()
    }
});

autoIncrement.initialize(mongoose.connection)
game.plugin(autoIncrement.plugin, {
    model: 'game',
    field: 'id',
    startAt: 1
})
export default mongoose.model('game', game);
