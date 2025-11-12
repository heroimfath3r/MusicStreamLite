//C:\Proyectos\MusicStreamLite\MusicStreamLite-backend\catalog-service\src\routes\index.js
import { Router } from 'express';
// Importa las nuevas rutas que moviste
import albumsRouter from './albums.js'; 
import artistsRouter from './artists.js'; 
import searchRouter from './search.js'; // La nueva ruta de búsqueda
import songsRouter from './songs.js'; // La nueva ruta de canciones
import catalogRouter from './catalog.js';
import genresRouter from './genres.js';
import streamRoute from './stream.js';


const router = Router();

router.use('/albums', albumsRouter);
router.use('/artists', artistsRouter);
router.use('/songs', songsRouter); 
router.use('/search', searchRouter);
router.use('/catalog', catalogRouter); // Nueva ruta de catálogo
router.use('/genres', genresRouter); // Nueva ruta de géneros
router.use('/stream', streamRoute); // Nueva ruta de streaming
// Añade aquí todas las demás rutas de catálogo

export default router;