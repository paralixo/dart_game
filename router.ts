import express from 'express'
import gamesRouter from "./routers/games"
import playersRouter from "./routers/players"

const router = express.Router();

router.use('/games', gamesRouter);
router.use('/players', playersRouter);

export default router;