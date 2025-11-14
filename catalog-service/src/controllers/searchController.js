// catalog-service/src/controllers/searchController.js
// ✅ CONTROLADOR PARA BÚSQUEDAS
// Usa query() de database.js para todas las operaciones

import { query } from '../config/database.js';

/**
 * Buscar en todas las entidades (canciones, artistas, álbumes)
 */
export const searchAll = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required'
      });
    }

    const searchTerm = `%${q.trim()}%`;

    // Buscar canciones
    const songsQuery = `
      SELECT
        s.song_id as id,
        s.title,
        s.duration,
        s.audio_file_url,
        a.name as artist_name,
        al.title as album_title
      FROM songs s
      LEFT JOIN artists a ON s.artist_id = a.artist_id
      LEFT JOIN albums al ON s.album_id = al.album_id
      WHERE s.title ILIKE $1
      ORDER BY s.title
      LIMIT 20
    `;

    // Buscar artistas
    const artistsQuery = `
      SELECT
        artist_id as id,
        name,
        bio,
        image_url
      FROM artists
      WHERE name ILIKE $1
      ORDER BY name
      LIMIT 20
    `;

    // Buscar álbumes
    const albumsQuery = `
      SELECT
        al.album_id as id,
        al.title,
        al.release_date,
        al.cover_image_url,
        a.name as artist_name
      FROM albums al
      LEFT JOIN artists a ON al.artist_id = a.artist_id
      WHERE al.title ILIKE $1
      ORDER BY al.title
      LIMIT 20
    `;

    // Ejecutar todas las búsquedas en paralelo
    const [songsResult, artistsResult, albumsResult] = await Promise.all([
      query(songsQuery, [searchTerm]),
      query(artistsQuery, [searchTerm]),
      query(albumsQuery, [searchTerm])
    ]);

    res.status(200).json({
      success: true,
      query: q,
      results: {
        songs: songsResult,
        artists: artistsResult,
        albums: albumsResult
      },
      count: {
        songs: songsResult.length,
        artists: artistsResult.length,
        albums: albumsResult.length,
        total: songsResult.length + artistsResult.length + albumsResult.length
      }
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    next(error);
  }
};

/**
 * Buscar solo canciones
 */
export const searchSongs = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required'
      });
    }

    const searchTerm = `%${q.trim()}%`;

    const searchQuery = `
      SELECT
        s.song_id as id,
        s.title,
        s.duration,
        s.audio_file_url,
        a.name as artist_name,
        al.title as album_title,
        al.cover_image_url
      FROM songs s
      LEFT JOIN artists a ON s.artist_id = a.artist_id
      LEFT JOIN albums al ON s.album_id = al.album_id
      WHERE s.title ILIKE $1
      ORDER BY s.title
      LIMIT 50
    `;

    const result = await query(searchQuery, [searchTerm]);

    res.status(200).json({
      success: true,
      query: q,
      data: result,
      count: result.length
    });
  } catch (error) {
    console.error('Error buscando canciones:', error);
    next(error);
  }
};

/**
 * Buscar solo artistas
 */
export const searchArtists = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required'
      });
    }

    const searchTerm = `%${q.trim()}%`;

    const searchQuery = `
      SELECT
        artist_id as id,
        name,
        bio,
        image_url
      FROM artists
      WHERE name ILIKE $1
      ORDER BY name
      LIMIT 50
    `;

    const result = await query(searchQuery, [searchTerm]);

    res.status(200).json({
      success: true,
      query: q,
      data: result,
      count: result.length
    });
  } catch (error) {
    console.error('Error buscando artistas:', error);
    next(error);
  }
};

/**
 * Buscar solo álbumes
 */
export const searchAlbums = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required'
      });
    }

    const searchTerm = `%${q.trim()}%`;

    const searchQuery = `
      SELECT
        al.album_id as id,
        al.title,
        al.release_date,
        al.cover_image_url,
        a.name as artist_name
      FROM albums al
      LEFT JOIN artists a ON al.artist_id = a.artist_id
      WHERE al.title ILIKE $1
      ORDER BY al.title
      LIMIT 50
    `;

    const result = await query(searchQuery, [searchTerm]);

    res.status(200).json({
      success: true,
      query: q,
      data: result,
      count: result.length
    });
  } catch (error) {
    console.error('Error buscando álbumes:', error);
    next(error);
  }
};