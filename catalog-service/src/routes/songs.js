// backend/user-service/src/routes/songs.js
import express from 'express';
import { 
  getAllSongs, 
  getSongById, 
  createSong, 
  updateSong, 
  deleteSong,
  getStreamUrl  // ✅ Importa la nueva función
} from '../controllers/songController.js';

const router = express.Router();


router.get('/:id/stream-url', getStreamUrl);  // ✅ Esta debe ir ANTES de /:id
router.get('/:id', getSongById);
router.get('/', getAllSongs);
router.post('/', createSong);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);

export default router;
