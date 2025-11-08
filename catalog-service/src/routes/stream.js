import express from 'express';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const router = express.Router();

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar Storage de Google Cloud
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID || 'musicstreamlite',
  keyFilename: process.env.GCP_KEY_FILE || path.join(__dirname, '../../service-account-key.json')
});

const bucket = storage.bucket(process.env.GCS_BUCKET || 'music-stream-lite-bucket');

/**
 * GET /api/songs/:songId/stream-url
 * 
 * Genera una URL firmada de Google Cloud Storage
 * Válida por 24 horas
 * 
 * Parámetros:
 *   - songId: ID de la canción
 * 
 * Respuesta:
 *   {
 *     url: "https://storage.googleapis.com/...",
 *     expiresIn: 86400,
 *     songId: "123"
 *   }
 */
router.get('/songs/:songId/stream-url', async (req, res) => {
  try {
    const { songId } = req.params;

    // AQUÍ IRÍA: Buscar la canción en BD para obtener su ruta en GCS
    // Por ahora usamos una ruta fija para testing
    // DESPUÉS harás:
    // const song = await Song.findById(songId);
    // const gcsPath = song.gcsFilePath;

    const gcsPath = `xxxtentacion-Find-Me.mp3`; // Ejemplo fijo

    // Referencia al archivo en el bucket
    const file = bucket.file(gcsPath);

    // Verificar que el archivo existe
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({ 
        error: 'Archivo de audio no encontrado',
        songId 
      });
    }

    // Generar URL firmada con 24 horas de expiración
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 horas en milisegundos
    });

    // Responder con la URL
    res.json({
      success: true,
      url: signedUrl,
      expiresIn: 24 * 60 * 60, // Segundos
      songId,
      message: 'URL lista para reproducir por 24 horas'
    });

  } catch (error) {
    console.error('Error generando URL firmada:', error);
    res.status(500).json({
      error: 'Error generando URL de reproducción',
      message: error.message
    });
  }
});

export default router;