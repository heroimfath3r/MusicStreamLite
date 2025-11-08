// routes/index.js
import express from 'express';
import usersRouter from './users.js';
import playlistsRouter from './playlists.js';
import songsRouter from './songs.js';
import searchRouter from './search.js';
import albumusRouter from './albums.js';
import artistsRouter from './artists.js';
import genresRouter from './genres.js';
import favoritesRouter from './favorites.js';
import playHistoryRouter from './play_history.js';

const router = express.Router();

router.use('/auth', usersRouter);
router.use('/users', usersRouter);        // GET /api/users/profile, PUT /api/users/profile
router.use('/playlists', playlistsRouter); // GET /api/playlists, POST /api/playlists
router.use('/songs', songsRouter);
router.use('/search', searchRouter);      // GET /api/search?q=query
router.use('/albums', albumusRouter);
router.use('/artists', artistsRouter);
router.use('/genres', genresRouter);
router.use('/favorites', favoritesRouter);
router.use('/history', playHistoryRouter);


export default router;