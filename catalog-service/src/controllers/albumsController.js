// catalog-service/src/controllers/albumsController.js
// ✅ CONTROLADOR PARA ÁLBUMES
// Usa query() de database.js para todas las operaciones

import { query } from "../config/database.js";

/**
 * Helper: valida si un ID es numérico
 */
const validateId = (id) => !isNaN(Number(id)) && Number(id) > 0;

// ============================================================
// GET /albums  → Obtiene todos los álbumes
// ============================================================
export const getAlbums = async (req, res, next) => {
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

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('❌ Error fetching albums:', error);
    next(error);
  }
};

// ============================================================
// GET /albums/artist/:artistId  → Obtiene álbumes de un artista
// ============================================================
export const getAlbumsByArtist = async (req, res, next) => {
  try {
    const { artistId } = req.params;

    if (!validateId(artistId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid artist ID',
      });
    }

    const sql = `
      SELECT 
        al.*,
        ar.name AS artist_name,
        COUNT(s.song_id) AS song_count
      FROM albums al
      LEFT JOIN artists ar ON al.artist_id = ar.artist_id
      LEFT JOIN songs s ON al.album_id = s.album_id
      WHERE al.artist_id = $1
      GROUP BY al.album_id, ar.artist_id
      ORDER BY al.release_date DESC
    `;

    const rows = await query(sql, [artistId]);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('❌ Error fetching albums by artist:', error);
    next(error);
  }
};

// ============================================================
// GET /albums/:id  → Obtiene un álbum específico por ID
// ============================================================
export const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID',
      });
    }

    const sql = `
      SELECT 
        al.*,
        ar.name AS artist_name
      FROM albums al
      LEFT JOIN artists ar ON al.artist_id = ar.artist_id
      WHERE al.album_id = $1
    `;

    const rows = await query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Album not found',
      });
    }

    // Obtener canciones del álbum
    const songsSql = `
      SELECT * FROM songs
      WHERE album_id = $1
      ORDER BY track_number ASC, title ASC
    `;
    const songs = await query(songsSql, [id]);

    res.status(200).json({
      success: true,
      data: {
        ...rows[0],
        songs
      },
    });
  } catch (error) {
    console.error('❌ Error fetching album:', error);
    next(error);
  }
};

// ============================================================
// POST /albums  → Crea un nuevo álbum
// ============================================================
export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist_id, release_date, cover_image_url } = req.body;

    if (!title || !artist_id) {
      return res.status(400).json({
        success: false,
        message: 'Title and artist_id are required',
      });
    }

    if (!validateId(artist_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid artist_id',
      });
    }

    const sql = `
      INSERT INTO albums (title, artist_id, release_date, cover_image_url, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `;

    const rows = await query(sql, [
      title.trim(),
      Number(artist_id),
      release_date || null,
      cover_image_url || null,
    ]);

    res.status(201).json({
      success: true,
      message: 'Album created successfully',
      data: rows[0],
    });
  } catch (error) {
    console.error('❌ Error creating album:', error);

    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        message: 'The specified artist does not exist',
      });
    }

    next(error);
  }
};

// ============================================================
// PUT /albums/:id  → Actualiza un álbum existente
// ============================================================
export const updateAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID',
      });
    }

    const updates = req.body;
    const validFields = ['title', 'artist_id', 'release_date', 'cover_image_url'];

    const fieldsToUpdate = Object.keys(updates).filter(
      (field) => validFields.includes(field) && updates[field] !== undefined
    );

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }

    const setClause = fieldsToUpdate
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ');

    const values = [id, ...fieldsToUpdate.map((f) => updates[f])];

    const sql = `
      UPDATE albums
      SET ${setClause}, updated_at = NOW()
      WHERE album_id = $1
      RETURNING *
    `;

    const rows = await query(sql, values);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Album not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Album updated successfully',
      data: rows[0],
    });
  } catch (error) {
    console.error('❌ Error updating album:', error);

    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        message: 'The specified artist does not exist',
      });
    }

    next(error);
  }
};

// ============================================================
// DELETE /albums/:id  → Elimina un álbum por ID
// ============================================================
export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID',
      });
    }

    const sql = 'DELETE FROM albums WHERE album_id = $1 RETURNING album_id';
    const rows = await query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Album not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Album deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting album:', error);

    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete album because it has associated songs',
      });
    }

    next(error);
  }
};