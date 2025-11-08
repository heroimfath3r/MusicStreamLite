import { uploadSong, listSongs, getSongUrl } from '../config/database.js';

// Obtener todas las canciones
export const getSongs = async (req, res) => {
  try {
    const songs = await listSongs();
    // Formatear respuesta para el frontend
    const formattedSongs = songs.map(song => ({
      id: song.name,
      title: song.name.replace(/\.[^/.]+$/, ""),
      url: song.url,
      artist_name: "Artista",
      plays: Math.floor(Math.random() * 1000),
      duration: "3:45"
    }));
    res.json({
      success: true,
      data: formattedSongs,
      count: formattedSongs.length
    });
  } catch (error) {
    console.error('Error getting songs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching songs',
      error: error.message
    });
  }
};

// Subir una nueva canción
export const uploadSongController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    const { originalname, buffer, mimetype } = req.file;
    // Validar que sea un archivo de audio
    if (!mimetype.startsWith('audio/')) {
      return res.status(400).json({
        success: false,
        message: 'Only audio files are allowed'
      });
    }
    // Subir a Cloud Storage
    const publicUrl = await uploadSong(buffer, originalname, mimetype);
    res.json({
      success: true,
      message: 'Song uploaded successfully',
      data: {
        name: originalname,
        url: publicUrl,
        type: mimetype
      }
    });
  } catch (error) {
    console.error('Error uploading song:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading song',
      error: error.message
    });
  }
};

// Obtener una canción específica
export const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const songUrl = getSongUrl(id);
    res.json({
      success: true,
      data: {
        id: id,
        url: songUrl,
        title: id.replace(/\.[^/.]+$/, ""),
        artist_name: "Artista",
        plays: Math.floor(Math.random() * 1000),
        duration: "3:45"
      }
    });
  } catch (error) {
    console.error('Error getting song:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching song',
      error: error.message
    });
  }
};

// Health check
export const healthCheck = (req, res) => {
  res.json({
    success: true,
    message: 'Catalog Service is running',
    timestamp: new Date().toISOString()
  });
};