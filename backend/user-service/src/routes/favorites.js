// backend/user-service/src/routes/favorites.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Favorites endpoint ready' });
});

export default router;
