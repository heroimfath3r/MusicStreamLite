// catalog-service/src/routes/stream.js
import express from 'express';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ⚠️ IMPORTAR CLIENTE DE BASE DE DATOS AQUÍ
// Asumiendo una estructura de configuración similar a la del User Service
import { pool } from '../config/database.js'; // ⬅️ Nuevo: Cliente de la DB

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
 *  * Genera una URL firmada de Google Cloud Storage
 * Válida por 24 horas
 *  * Parámetros:
 *   - songId: ID de la canción (UUID o Serial)
 *  * Respuesta:
 *   {
 *     url: "https://storage.googleapis.com/...",
 *     expiresIn: 86400,
 *     songId: "123"
 *   }
 */
router.get('/songs/:songId/stream-url', async (req, res) => {
try {
   const { songId } = req.params;

 // 1. 🔍 Consultar la base de datos para obtener la ruta del archivo en GCS
 const songResult = await pool.query(
  `SELECT gcs_file_path FROM songs WHERE song_id = $1`,
   [songId]
  );

  if (songResult.rows.length === 0) {
   return res.status(404).json({ 
  error: 'Canción no encontrada en el Catálogo',
    songId 
   });
 }

 // Obtener la ruta real del archivo.
 // ⚠️ Se asume que el campo se llama 'gcs_file_path'
 const gcsPath = songResult.rows[0].gcs_file_path; 

 if (!gcsPath) {
 return res.status(404).json({ 
 error: 'La canción no tiene una ruta de archivo asociada',
 songId 
 });
 }

 // 2. 📁 Referencia al archivo en el bucket
 const file = bucket.file(gcsPath);

 // Verificar que el archivo existe en GCS
 const [exists] = await file.exists();
 if (!exists) {
 return res.status(404).json({ 
 error: `Archivo de audio no encontrado en el bucket para la ruta: ${gcsPath}`,
 songId 
  });
 }

 // 3. 🔑 Generar URL firmada con 24 horas de expiración
 const oneDay = 24 * 60 * 60 * 1000;
 const [signedUrl] = await file.getSignedUrl({
 version: 'v4',
 action: 'read',
 expires: Date.now() + oneDay, // 24 horas en milisegundos
 });

 // Responder con la URL
 res.json({
 success: true,
 url: signedUrl,
 expiresIn: oneDay / 1000, // Segundos
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