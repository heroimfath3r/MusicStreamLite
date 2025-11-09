// catalog-service/src/config/database.js
import { Storage } from '@google-cloud/storage';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config(); // Para leer variables de entorno desde .env

const { Pool } = pkg;

// -----------------------------------
// 🔹 CONFIGURACIÓN DE GOOGLE CLOUD STORAGE
// -----------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = new Storage({
  projectId: 'musicstreamlite',
  // En Cloud Run no se necesita keyFilename
});

const musicBucket = storage.bucket('music-stream-lite-bucket');

export const uploadSong = async (fileBuffer, fileName, mimetype) => {
  try {
    const file = musicBucket.file(fileName);
    await file.save(fileBuffer, {
      metadata: {
        contentType: mimetype,
      },
    });
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/music-stream-lite-bucket/${fileName}`;
    console.log(`✅ Canción subida: ${fileName}`);
    return publicUrl;
  } catch (error) {
    console.error('❌ Error subiendo archivo:', error);
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

export const getSongUrl = (fileName) => {
  return `https://storage.googleapis.com/music-stream-lite-bucket/${fileName}`;
};

export const listSongs = async () => {
  try {
    const [files] = await musicBucket.getFiles();
    const songs = files.map(file => ({
      name: file.name,
      url: `https://storage.googleapis.com/music-stream-lite-bucket/${file.name}`,
      size: file.metadata.size,
      contentType: file.metadata.contentType,
      createdAt: file.metadata.timeCreated
    }));
    console.log(`📁 Encontradas ${songs.length} canciones en el bucket`);
    return songs;
  } catch (error) {
    console.error('❌ Error listando archivos:', error);
    throw new Error(`Error listing files: ${error.message}`);
  }
};

export const deleteSong = async (fileName) => {
  try {
    await musicBucket.file(fileName).delete();
    console.log(`🗑️ Canción eliminada: ${fileName}`);
    return true;
  } catch (error) {
    console.error('❌ Error eliminando archivo:', error);
    throw new Error(`Error deleting file: ${error.message}`);
  }
};

// -----------------------------------
// 🔹 CONFIGURACIÓN DE POSTGRESQL (CLOUD SQL)
// -----------------------------------

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (error) {
    console.error('❌ Error ejecutando query:', error);
    throw error;
  }
};

export { storage, musicBucket, pool };

export default {};
