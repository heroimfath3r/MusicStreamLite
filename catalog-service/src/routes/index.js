// catalog-service/src/routes/index.js
// 🎯 ESTE ARCHIVO ORGANIZA TODAS LAS RUTAS
// Es el único punto de entrada para todas las subrutas

import { Router } from 'express';
import albumsRouter from './albums.js'; 
import artistsRouter from './artists.js'; 
import searchRouter from './search.js';
import songsRouter from './songs.js';
import genresRouter from './genres.js';
import streamRouter from './stream.js';

const router = Router();

// ============================================================
// MONTA CADA SUBRUTAS CON SU PREFIJO CORRESPONDIENTE
// ============================================================

router.use('/songs', songsRouter);       // /api/songs/*
router.use('/artists', artistsRouter);   // /api/artists/*
router.use('/albums', albumsRouter);     // /api/albums/*
router.use('/search', searchRouter);     // /api/search/*
router.use('/genres', genresRouter);     // /api/genres/*
router.use('/stream', streamRouter);     // /api/stream/*

// ============================================================
// NOTA: catalogRouter se elimina porque es redundante
// Todas las rutas ya están cubiertas por los archivos anteriores
// ============================================================

export default router;