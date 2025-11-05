// backend/user-service/src/routes/play_history.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Play history endpoint ready' });
});

export default router;
