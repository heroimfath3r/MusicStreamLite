// catalog-service/src/routes/artists.js
import express from 'express';
import {
  getArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist
} from '../controllers/artistsController.js';

const router = express.Router();

router.get('/', getArtists);
router.post('/', createArtist);
router.get('/:id', getArtistById);
router.put('/:id', updateArtist);
router.delete('/:id', deleteArtist);

export default router;