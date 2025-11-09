// catalog-service/src/controllers/catalogController.js
import pool from '../config/database.js';
import { query } from "../config/database.js";


// ============================================
// SONGS (Ya las tienes)
// ============================================
export const getSongs = async (req, res) => {
  try {
    const { limit = 50, offset = 0, sort = 'created_at', order = 'DESC' } = req.query;
    
    const query = `
      SELECT 
        s.*,
        ar.name as artist_name,
        al.title as album_name
      FROM songs s
      LEFT JOIN artists ar ON s.artist_id = ar.artist_id
      LEFT JOIN albums al ON s.album_id = al.album_id
      ORDER BY ${sort} ${order}
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching songs',
      error: error.message
    });
  }
};

export const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        s.*,
        ar.name as artist_name,
        al.title as album_name
      FROM songs s
      LEFT JOIN artists ar ON s.artist_id = ar.artist_id
      LEFT JOIN albums al ON s.album_id = al.album_id
      WHERE s.song_id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching song',
      error: error.message
    });
  }
};

// ============================================
// ARTISTS (Nuevo)
// ============================================
export const getArtists = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const query = `
      SELECT 
        ar.*,
        COUNT(DISTINCT s.song_id) as song_count,
        COUNT(DISTINCT al.album_id) as album_count
      FROM artists ar
      LEFT JOIN songs s ON ar.artist_id = s.artist_id
      LEFT JOIN albums al ON ar.artist_id = al.artist_id
      GROUP BY ar.artist_id
      ORDER BY ar.name ASC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching artists',
      error: error.message
    });
  }
};

export const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener información del artista
    const artistQuery = `
      SELECT 
        ar.*,
        COUNT(DISTINCT s.song_id) as song_count,
        COUNT(DISTINCT al.album_id) as album_count
      FROM artists ar
      LEFT JOIN songs s ON ar.artist_id = s.artist_id
      LEFT JOIN albums al ON ar.artist_id = al.artist_id
      WHERE ar.artist_id = $1
      GROUP BY ar.artist_id
    `;
    
    const artistResult = await pool.query(artistQuery, [id]);
    
    if (artistResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }
    
    // Obtener canciones del artista
    const songsQuery = `
      SELECT s.*, al.title as album_name
      FROM songs s
      LEFT JOIN albums al ON s.album_id = al.album_id
      WHERE s.artist_id = $1
      ORDER BY s.created_at DESC
      LIMIT 20
    `;
    
    const songsResult = await pool.query(songsQuery, [id]);
    
    // Obtener álbumes del artista
    const albumsQuery = `
      SELECT * FROM albums
      WHERE artist_id = $1
      ORDER BY release_date DESC
    `;
    
    const albumsResult = await pool.query(albumsQuery, [id]);
    
    res.json({
      success: true,
      data: {
        ...artistResult.rows[0],
        songs: songsResult.rows,
        albums: albumsResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching artist:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching artist',
      error: error.message
    });
  }
};

// ============================================
// ALBUMS (Nuevo)
// ============================================
export const getAlbums = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const query = `
      SELECT 
        al.*,
        ar.name as artist_name,
        COUNT(s.song_id) as song_count
      FROM albums al
      LEFT JOIN artists ar ON al.artist_id = ar.artist_id
      LEFT JOIN songs s ON al.album_id = s.album_id
      GROUP BY al.album_id, ar.artist_id
      ORDER BY al.release_date DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching albums',
      error: error.message
    });
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener información del álbum
    const albumQuery = `
      SELECT 
        al.*,
        ar.name as artist_name
      FROM albums al
      LEFT JOIN artists ar ON al.artist_id = ar.artist_id
      WHERE al.album_id = $1
    `;
    
    const albumResult = await pool.query(albumQuery, [id]);
    
    if (albumResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Album not found'
      });
    }
    
    // Obtener canciones del álbum
    const songsQuery = `
      SELECT * FROM songs
      WHERE album_id = $1
      ORDER BY track_number ASC, title ASC
    `;
    
    const songsResult = await pool.query(songsQuery, [id]);
    
    res.json({
      success: true,
      data: {
        ...albumResult.rows[0],
        songs: songsResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching album',
      error: error.message
    });
  }
};

// ============================================
// SEARCH (Nuevo)
// ============================================
export const searchAll = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.json({
        success: true,
        results: {
          songs: [],
          artists: [],
          albums: []
        }
      });
    }
    
    const searchTerm = `%${q.toLowerCase()}%`;
    
    // Buscar canciones
    const songsQuery = `
      SELECT 
        s.*,
        ar.name as artist_name,
        al.title as album_title
      FROM songs s
      LEFT JOIN artists ar ON s.artist_id = ar.artist_id
      LEFT JOIN albums al ON s.album_id = al.album_id
      WHERE LOWER(s.title) LIKE $1
      LIMIT 10
    `;
    
    // Buscar artistas
    const artistsQuery = `
      SELECT * FROM artists
      WHERE LOWER(name) LIKE $1
      LIMIT 10
    `;
    
    // Buscar álbumes
    const albumsQuery = `
      SELECT 
        al.*,
        ar.name as artist_name
      FROM albums al
      LEFT JOIN artists ar ON al.artist_id = ar.artist_id
      WHERE LOWER(al.title) LIKE $1
      LIMIT 10
    `;
    
    const [songsResult, artistsResult, albumsResult] = await Promise.all([
      pool.query(songsQuery, [searchTerm]),
      pool.query(artistsQuery, [searchTerm]),
      pool.query(albumsQuery, [searchTerm])
    ]);
    
    res.json({
      success: true,
      results: {
        songs: songsResult.rows,
        artists: artistsResult.rows,
        albums: albumsResult.rows
      }
    });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing search',
      error: error.message
    });
  }
};

// Exportar uploadSongController si lo tienes
export const uploadSongController = async (req, res) => {
  // Tu implementación actual
  res.status(501).json({
    success: false,
    message: 'Upload not implemented yet'
  });
};