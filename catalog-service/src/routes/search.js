// catalog-service/src/routes/search.js
// ✅ RUTAS PARA BÚSQUEDA
// Importa de searchController que SÍ existe

import express from 'express';
import {
  searchAll,
  searchSongs,
  searchArtists,
  searchAlbums
} from '../controllers/searchController.js';

const router = express.Router();

// ============================================================
// BÚSQUEDA GENERAL (todas las entidades)
// ============================================================
router.get('/', searchAll);

// ============================================================
// BÚSQUEDAS ESPECÍFICAS POR TIPO
// ============================================================
// GET /search/songs?q=query     → Buscar solo canciones
// GET /search/artists?q=query   → Buscar solo artistas
// GET /search/albums?q=query    → Buscar solo álbumes

router.get('/songs', searchSongs);
router.get('/artists', searchArtists);
router.get('/albums', searchAlbums);

export default router;