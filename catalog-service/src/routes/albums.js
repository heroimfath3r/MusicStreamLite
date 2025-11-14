// catalog-service/src/routes/albums.js
import express from 'express';
import {
  getAlbums,
  getAlbumById,
  getAlbumsByArtist,
  createAlbum,
  updateAlbum,
  deleteAlbum
} from '../controllers/albumsController.js';

const router = express.Router();

router.get('/', getAlbums);
router.post('/', createAlbum);
router.get('/artist/:artistId', getAlbumsByArtist);
router.get('/:id', getAlbumById);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

export default router;