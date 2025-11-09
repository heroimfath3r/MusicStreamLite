import express from 'express';
import { 
  getSongs, 
  getSongById, 
  uploadSongController,
  getArtists,
  getArtistById,
  getAlbums,
  getAlbumById,
  searchAll
} from '../controllers/catalogController.js';

const router = express.Router();

// ============================================
// SONGS (Canciones)
// ============================================
router.get('/songs', getSongs);
router.get('/songs/:id', getSongById);
router.post('/songs', uploadSongController); // Si tienes este endpoint

// ============================================
// ARTISTS (Artistas)
// ============================================
router.get('/artists', getArtists);
router.get('/artists/:id', getArtistById);

// ============================================
// ALBUMS (Álbumes)
// ============================================
router.get('/albums', getAlbums);
router.get('/albums/:id', getAlbumById);

// ============================================
// SEARCH (Búsqueda)
// ============================================
router.get('/search', searchAll);

export default router;