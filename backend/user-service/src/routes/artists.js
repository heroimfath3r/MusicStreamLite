// backend/user-service/src/routes/artists.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Artists endpoint ready' });
});

export default router;
