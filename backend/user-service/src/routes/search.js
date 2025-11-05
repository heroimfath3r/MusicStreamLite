// backend/user-service/src/routes/search.js
import express from 'express';
import {
  searchAll,
  searchSongs,
  searchArtists,
  searchAlbums
} from '../controllers/searchController.js';

const router = express.Router();

// Búsqueda general (todas las entidades)
router.get('/', searchAll);

// Búsquedas específicas por tipo
router.get('/songs', searchSongs);
router.get('/artists', searchArtists);
router.get('/albums', searchAlbums);

export default router;
