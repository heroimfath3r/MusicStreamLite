// routes/index.js
import express from 'express';
import usersRouter from './users.js';
import playlistsRouter from './playlists.js';
import songsRouter from './songs.js';
import searchRouter from './search.js';

const router = express.Router();

router.use('/auth', usersRouter);
router.use('/users', usersRouter);        // GET /api/users/profile, PUT /api/users/profile
router.use('/playlists', playlistsRouter); // GET /api/playlists, POST /api/playlists
router.use('/songs', songsRouter);
router.use('/search', searchRouter);      // GET /api/search?q=query


export default router;