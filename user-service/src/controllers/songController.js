// backend/user-service/src/controllers/songController.js
import { pool } from '../config/database.js';

// Obtener todas las canciones
export const getAllSongs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM songs ORDER BY song_id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener canciones:', error);
    res.status(500).json({ message: 'Error al obtener canciones' });
  }
};

// Obtener una canción por ID
export const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM songs WHERE song_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener canción:', error);
    res.status(500).json({ message: 'Error al obtener canción' });
  }
};

// Crear nueva canción
export const createSong = async (req, res) => {
  try {
    const { album_id, artist_id, genre_id, title, duration, audio_file_url, track_number } = req.body;

    const result = await pool.query(
      `INSERT INTO songs (album_id, artist_id, genre_id, title, duration, audio_file_url, track_number, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())
       RETURNING *`,
      [album_id, artist_id, genre_id, title, duration, audio_file_url, track_number]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear canción:', error);
    res.status(500).json({ message: 'Error al crear canción' });
  }
};

// Actualizar canción
export const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const { album_id, artist_id, genre_id, title, duration, audio_file_url, track_number } = req.body;

    const result = await pool.query(
      `UPDATE songs SET
        album_id=$1,
        artist_id=$2,
        genre_id=$3,
        title=$4,
        duration=$5,
        audio_file_url=$6,
        track_number=$7,
        updated_at=NOW()
       WHERE song_id=$8 RETURNING *`,
      [album_id, artist_id, genre_id, title, duration, audio_file_url, track_number, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar canción:', error);
    res.status(500).json({ message: 'Error al actualizar canción' });
  }
};

// Eliminar canción
export const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM songs WHERE song_id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }
    res.status(200).json({ message: 'Canción eliminada', song: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar canción:', error);
    res.status(500).json({ message: 'Error al eliminar canción' });
  }
};
// Obtener URL de streaming (firmada o directa)
export const getStreamUrl = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT audio_file_url FROM songs WHERE song_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Canción no encontrada' });
    }

    const audioUrl = result.rows[0].audio_file_url;

    // Por ahora devolver URL directa
    // TODO: Implementar firma con Google Cloud Storage
    res.status(200).json({
      url: audioUrl,
      expiresIn: 86400 // 24 horas en segundos
    });

  } catch (error) {
    console.error('Error obteniendo stream URL:', error);
    res.status(500).json({ error: 'Error al obtener URL de streaming' });
  }
};