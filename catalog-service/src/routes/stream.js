// catalog-service/src/routes/stream.js
import express from 'express';
import { getStreamUrl } from '../controllers/streamController.js';

const router = express.Router();

router.get('/songs/:songId/stream-url', getStreamUrl);

export default router;