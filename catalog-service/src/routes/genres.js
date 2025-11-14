// catalog-service/src/routes/genres.js
import express from 'express';
import {
  getGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre
} from '../controllers/genresController.js';

const router = express.Router();

router.get('/', getGenres);
router.post('/', createGenre);
router.get('/:id', getGenreById);
router.put('/:id', updateGenre);
router.delete('/:id', deleteGenre);

export default router;