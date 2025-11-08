// backend/user-service/src/routes/playlists.js
import express from 'express';
import { 
  createPlaylist, 
  getPlaylists,
  getPlaylistSongs,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Gestión de playlists
router.post('/', authenticateToken, createPlaylist);                    // Crear playlist
router.get('/', authenticateToken, getPlaylists);                       // Obtener todas
router.get('/:playlist_id/songs', authenticateToken, getPlaylistSongs);       // Ver canciones
router.delete('/:playlist_id', authenticateToken, deletePlaylist);      // Eliminar playlist
router.post('/:playlist_id/songs', authenticateToken, addSongToPlaylist);         // Agregar canción
router.delete('/:playlist_id/songs/:song_id', authenticateToken, removeSongFromPlaylist); // Quitar canción

export default router;