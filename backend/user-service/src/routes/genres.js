// backend/user-service/src/routes/genres.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Genres endpoint ready' });
});

export default router;
