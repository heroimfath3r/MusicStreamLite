// catalog-service/src/routes/songs.js
// ✅ RUTAS PARA CANCIONES
// Importa del catalogController que SÍ existe

import express from 'express';
import { 
  getSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong
} from '../controllers/catalogController.js';

const router = express.Router();

// ============================================================
// IMPORTANTE: Las rutas dinámicas deben ordenarse correctamente
// Las rutas específicas van ANTES que las genéricas
// ============================================================

// GET /songs  → Listar todas las canciones
// query params: limit, offset, sort, order
router.get('/', getSongs);

// POST /songs  → Crear una nueva canción
router.post('/', createSong);

// GET /songs/:id  → Obtener canción por ID
router.get('/:id', getSongById);

// PUT /songs/:id  → Actualizar canción
router.put('/:id', updateSong);

// DELETE /songs/:id  → Eliminar canción
router.delete('/:id', deleteSong);

// ============================================================
// NOTA: El endpoint de stream (/stream/:id) está en stream.js
// No va aquí para mantener la separación de responsabilidades
// ============================================================

export default router;