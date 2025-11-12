// catalog-service/src/controllers/catalogController.js
import { query } from "../config/database.js";

// ============================================
// 🎵 SONGS: LECTURA (GET)
// ============================================
export const getSongs = async (req, res) => {
  try {
    const { limit = 50, offset = 0, sort = 'created_at', order = 'DESC' } = req.query;

    const sql = `
      SELECT 
        s.*,
        ar.name AS artist_name,
        al.title AS album_name
      FROM songs s
      LEFT JOIN artists ar ON s.artist_id = ar.artist_id
      LEFT JOIN albums al ON s.album_id = al.album_id
      ORDER BY ${sort} ${order}
      LIMIT $1 OFFSET $2
    `;

    const rows = await query(sql, [limit, offset]);

    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    console.error('❌ Error fetching songs:', error);
    res.status(500).json({ success: false, message: 'Error fetching songs', error: error.message });
  }
};

export const getSongById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        s.*,
        ar.name AS artist_name,
        al.title AS album_name
      FROM songs s
      LEFT JOIN artists ar ON s.artist_id = ar.artist_id
      LEFT JOIN albums al ON s.album_id = al.album_id
      WHERE s.song_id = $1
    `;

    const rows = await query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('❌ Error fetching song:', error);
    res.status(500).json({ success: false, message: 'Error fetching song', error: error.message });
  }
};

// ============================================
// ➕ SONGS: CREACIÓN (POST)
// ============================================
export const createSong = async (req, res) => {
  try {
    // Nota: Asumimos que esta ruta está protegida para ser usada solo por administradores o un servicio de ingesta
    const { album_id, artist_id, genre_id, title, duration, audio_file_url, track_number } = req.body;

    if (!title || !artist_id || !audio_file_url) {
      return res.status(400).json({ success: false, message: 'Title, artist_id, and audio_file_url are required' });
    }

    const sql = `
      INSERT INTO songs (album_id, artist_id, genre_id, title, duration, audio_file_url, track_number, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())
      RETURNING *`;
    
    const rows = await query(sql, 
      [album_id || null, artist_id, genre_id || null, title, duration || 0, audio_file_url, track_number || null]
    );

    res.status(201).json({ success: true, message: 'Song created successfully', data: rows[0] });
  } catch (error) {
    console.error('❌ Error creating song:', error);
    res.status(500).json({ success: false, message: 'Error creating song', error: error.message });
  }
};

// ============================================
// ✏️ SONGS: ACTUALIZACIÓN (PUT)
// ============================================
export const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const { album_id, artist_id, genre_id, title, duration, audio_file_url, track_number } = req.body;

    const updates = [];
    const values = [];
    let index = 1;

    // Construcción dinámica de la consulta
    const fields = { album_id, artist_id, genre_id, title, duration, audio_file_url, track_number };

    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
            updates.push(`${key} = $${index++}`);
            values.push(value);
        }
    }
    
    if (updates.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    updates.push('updated_at = NOW()');
    values.push(id); // ID es el último parámetro en la cláusula WHERE

    const sql = `
      UPDATE songs SET
        ${updates.join(', ')} 
      WHERE song_id = $${index} 
      RETURNING *`;
    
    const rows = await query(sql, values);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    res.status(200).json({ success: true, message: 'Song updated successfully', data: rows[0] });
  } catch (error) {
    console.error('❌ Error updating song:', error);
    res.status(500).json({ success: false, message: 'Error updating song', error: error.message });
  }
};

// ============================================
// 🗑️ SONGS: ELIMINACIÓN (DELETE)
// ============================================
export const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = 'DELETE FROM songs WHERE song_id=$1 RETURNING *';
    const rows = await query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    res.status(200).json({ success: true, message: 'Song deleted successfully', data: rows[0] });
  } catch (error) {
    console.error('❌ Error deleting song:', error);
    res.status(500).json({ success: false, message: 'Error deleting song', error: error.message });
  }
};

// ============================================
// ARTISTS
// ============================================
export const getArtists = async (req, res) => {
  // ... (Lógica de getArtists)
  try {
    const { limit = 50, offset = 0 } = req.query;

    const sql = `
      SELECT 
        ar.*,
        COUNT(DISTINCT s.song_id) AS song_count,
        COUNT(DISTINCT al.album_id) AS album_count
      FROM artists ar
      LEFT JOIN songs s ON ar.artist_id = s.artist_id
      LEFT JOIN albums al ON ar.artist_id = al.artist_id
      GROUP BY ar.artist_id
      ORDER BY ar.name ASC
      LIMIT $1 OFFSET $2
    `;

    const rows = await query(sql, [limit, offset]);

    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    console.error('❌ Error fetching artists:', error);
    res.status(500).json({ success: false, message: 'Error fetching artists', error: error.message });
  }
};

export const getArtistById = async (req, res) => {
  // ... (Lógica de getArtistById)
  try {
    const { id } = req.params;

    const artistSql = `
      SELECT 
        ar.*,
        COUNT(DISTINCT s.song_id) AS song_count,
        COUNT(DISTINCT al.album_id) AS album_count
      FROM artists ar
      LEFT JOIN songs s ON ar.artist_id = s.artist_id
      LEFT JOIN albums al ON ar.artist_id = al.artist_id
      WHERE ar.artist_id = $1
      GROUP BY ar.artist_id
    `;
    const artistRows = await query(artistSql, [id]);

    if (artistRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }

    const songsSql = `
      SELECT s.*, al.title AS album_name
      FROM songs s
      LEFT JOIN albums al ON s.album_id = al.album_id
      WHERE s.artist_id = $1
      ORDER BY s.created_at DESC
      LIMIT 20
    `;
    const songs = await query(songsSql, [id]);

    const albumsSql = `
      SELECT * FROM albums
      WHERE artist_id = $1
      ORDER BY release_date DESC
    `;
    const albums = await query(albumsSql, [id]);

    res.json({
      success: true,
      data: {
        ...artistRows[0],
        songs,
        albums
      }
    });
  } catch (error) {
    console.error('❌ Error fetching artist:', error);
    res.status(500).json({ success: false, message: 'Error fetching artist', error: error.message });
  }
};

// ============================================
// ALBUMS
// ============================================
export const getAlbums = async (req, res) => {
  // ... (Lógica de getAlbums)
  try {
    const { limit = 50, offset = 0 } = req.query;

    const sql = `
      SELECT 
        al.*,
        ar.name AS artist_name,
        COUNT(s.song_id) AS song_count
      FROM albums al
      LEFT JOIN artists ar ON al.artist_id = ar.artist_id
      LEFT JOIN songs s ON al.album_id = s.album_id
      GROUP BY al.album_id, ar.artist_id
      ORDER BY al.release_date DESC
      LIMIT $1 OFFSET $2
    `;

    const rows = await query(sql, [limit, offset]);

    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    console.error('❌ Error fetching albums:', error);
    res.status(500).json({ success: false, message: 'Error fetching albums', error: error.message });
  }
};

export const getAlbumById = async (req, res) => {
  // ... (Lógica de getAlbumById)
  try {
    const { id } = req.params;

    const albumSql = `
      SELECT 
        al.*,
        ar.name AS artist_name
      FROM albums al
      LEFT JOIN artists ar ON al.artist_id = ar.artist_id
      WHERE al.album_id = $1
    `;
    const albumRows = await query(albumSql, [id]);

    if (albumRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    const songsSql = `
      SELECT * FROM songs
      WHERE album_id = $1
      ORDER BY track_number ASC, title ASC
    `;
    const songs = await query(songsSql, [id]);

    res.json({
      success: true,
      data: {
        ...albumRows[0],
        songs
      }
    });
  } catch (error) {
    console.error('❌ Error fetching album:', error);
    res.status(500).json({ success: false, message: 'Error fetching album', error: error.message });
  }
};

// ============================================
// SEARCH
// ============================================
export const searchAll = async (req, res) => {
  // ... (Lógica de searchAll)
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.json({
        success: true,
        results: { songs: [], artists: [], albums: [] }
      });
    }

    const searchTerm = `%${q.toLowerCase()}%`;

    const songsSql = `
      SELECT 
        s.*,
        ar.name AS artist_name,
        al.title AS album_title
      FROM songs s
      LEFT JOIN artists ar ON s.artist_id = ar.artist_id
      LEFT JOIN albums al ON s.album_id = al.album_id
      WHERE LOWER(s.title) LIKE $1
      LIMIT 10
    `;

    const artistsSql = `
      SELECT * FROM artists
      WHERE LOWER(name) LIKE $1
      LIMIT 10
    `;

    const albumsSql = `
      SELECT 
        al.*,
        ar.name AS artist_name
      FROM albums al
      LEFT JOIN artists ar ON al.artist_id = ar.artist_id
      WHERE LOWER(al.title) LIKE $1
      LIMIT 10
    `;

    const [songs, artists, albums] = await Promise.all([
      query(songsSql, [searchTerm]),
      query(artistsSql, [searchTerm]),
      query(albumsSql, [searchTerm])
    ]);

    res.json({
      success: true,
      results: { songs, artists, albums }
    });
  } catch (error) {
    console.error('❌ Error searching:', error);
    res.status(500).json({ success: false, message: 'Error performing search', error: error.message });
  }
};

// ============================================
// UPLOAD (placeholder)
// ============================================
export const uploadSongController = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Upload not implemented yet'
  });
};
