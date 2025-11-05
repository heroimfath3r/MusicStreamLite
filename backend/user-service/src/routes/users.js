// backend/user-service/src/routes/users.js
import express from 'express';
import { 
  register, 
  login, 
  getProfile,
  updateProfile,
  addFavorite,
  removeFavorite,
  getFavorites,
  recordPlay,
  getPlayHistory,
  getUserStats
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
router.post('/register', register);
router.post('/login', login);

// ==========================================
// RUTAS PROTEGIDAS - PERFIL
// ==========================================
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

// ==========================================
// RUTAS PROTEGIDAS - FAVORITOS
// ==========================================
router.post('/favorites', authenticateToken, addFavorite);
router.get('/favorites', authenticateToken, getFavorites);
router.delete('/favorites/:song_id', authenticateToken, removeFavorite);

// ==========================================
// RUTAS PROTEGIDAS - HISTORIAL Y STATS
// ==========================================
router.post('/play', authenticateToken, recordPlay);
router.get('/history', authenticateToken, getPlayHistory);
router.get('/stats', authenticateToken, getUserStats);

export default router;