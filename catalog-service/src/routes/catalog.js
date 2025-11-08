import express from 'express';
import { getSongs, getSongById, uploadSongController } from '../controllers/catalogController.js';

const router = express.Router();

// Rutas que existen en tu controlador
router.get('/songs', getSongs);
router.get('/songs/:id', getSongById);

// Rutas mock para las que no tienes controlador
router.get('/artists', (req, res) => {
  res.json({ 
    success: true, 
    data: [
      { id: 1, name: 'XXXTENTACION', genre: 'Hip Hop' },
      { id: 2, name: 'The Weeknd', genre: 'R&B' }
    ]
  });
});

router.get('/artists/:id', (req, res) => {
  res.json({ 
    success: true, 
    data: { id: req.params.id, name: 'Artista', genre: 'Género' }
  });
});

router.get('/search', (req, res) => {
  const { q } = req.query;
  res.json({ 
    success: true, 
    query: q,
    data: []
  });
});

export default router;