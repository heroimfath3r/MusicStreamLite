import { Storage } from '@google-cloud/storage';
import path from 'path';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Cloud Storage
const storage = new Storage({
  projectId: 'musicstreamlite'
  // En Cloud Run no necesita keyFilename
  // Usa automáticamente las credenciales del servicio
});

// Referencia a tu bucket
const musicBucket = storage.bucket('music-stream-lite-bucket');

// Función para subir archivos
export const uploadSong = async (fileBuffer, fileName, mimetype) => {
  try {
    const file = musicBucket.file(fileName);
    await file.save(fileBuffer, {
      metadata: {
        contentType: mimetype,
      },
    });
    // Hacer el archivo público para que el frontend pueda acceder
    await file.makePublic();
    // Obtener URL pública
    const publicUrl = `https://storage.googleapis.com/music-stream-lite-bucket/${fileName}`;
    console.log(`✅ Canción subida: ${fileName}`);
    return publicUrl;
  } catch (error) {
    console.error('❌ Error subiendo archivo:', error);
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

// Función para obtener URL de canción
export const getSongUrl = (fileName) => {
  return `https://storage.googleapis.com/music-stream-lite-bucket/${fileName}`;
};

// Función para listar todas las canciones
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

// Función para eliminar canción
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

export { storage, musicBucket };