// routes/index.js
import express from 'express';
import usersRouter from './users.js';
import playlistsRouter from './playlists.js';
import favoritesRouter from './favorites.js';
import playHistoryRouter from './play_history.js';

const router = express.Router();

router.use('/auth', usersRouter);
router.use('/users', usersRouter);        
router.use('/playlists', playlistsRouter); 
router.use('/favorites', favoritesRouter);
router.use('/history', playHistoryRouter);


export default router;