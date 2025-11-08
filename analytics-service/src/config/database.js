// backend/analytics-service/src/config/database.js
import { Firestore } from '@google-cloud/firestore';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuración de Firestore Database
 * Analytics Service usa Firestore para almacenar datos de reproducción
 * y métricas en tiempo real
 */

let firestoreInstance = null;

/**
 * Inicializa la conexión a Firestore
 * @returns {Firestore} Instancia de Firestore
 */
export const initFirestore = () => {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  try {
    const config = {
      projectId: process.env.FIRESTORE_PROJECT_ID || process.env.PROJECT_ID || 'musicstreamlite',
    };

    // En desarrollo local con emulador
    if (process.env.NODE_ENV === 'development' && process.env.FIRESTORE_EMULATOR_HOST) {
      console.log(`📊 Conectando a Firestore Emulator: ${process.env.FIRESTORE_EMULATOR_HOST}`);
      // El emulador no requiere credenciales
    } else if (process.env.NODE_ENV === 'production') {
      // En producción (Cloud Run), usa Application Default Credentials
      // Cloud Run automáticamente provee las credenciales del Service Account
      console.log(`📊 Conectando a Firestore Production: ${config.projectId}`);
    } else {
      // En desarrollo local sin emulador, puedes usar gcloud auth
      // o configurar GOOGLE_APPLICATION_CREDENTIALS
      console.log(`📊 Conectando a Firestore: ${config.projectId}`);
      console.log(`💡 Asegúrate de haber ejecutado: gcloud auth application-default login`);
    }

    firestoreInstance = new Firestore(config);

    console.log('✅ Firestore inicializado correctamente');
    return firestoreInstance;
  } catch (error) {
    console.error('❌ Error al inicializar Firestore:', error);
    throw error;
  }
};

/**
 * Obtiene la instancia de Firestore
 * @returns {Firestore} Instancia de Firestore
 */
export const getFirestore = () => {
  if (!firestoreInstance) {
    return initFirestore();
  }
  return firestoreInstance;
};

/**
 * Cierra la conexión a Firestore
 */
export const closeFirestore = async () => {
  if (firestoreInstance) {
    await firestoreInstance.terminate();
    firestoreInstance = null;
    console.log('🔌 Firestore desconectado');
  }
};

/**
 * Verifica la conexión a Firestore
 * @returns {Promise<boolean>} True si la conexión es exitosa
 */
export const checkFirestoreConnection = async () => {
  try {
    const db = getFirestore();
    // Intenta leer una colección ficticia para verificar conexión
    await db.collection('_health_check').limit(1).get();
    console.log('✅ Health check de Firestore exitoso');
    return true;
  } catch (error) {
    console.error('❌ Error en health check de Firestore:', error.message);
    return false;
  }
};

/**
 * Nombres de colecciones (constantes)
 * Mantiene organizada la estructura de datos en Firestore
 */
export const COLLECTIONS = {
  PLAYS: 'plays',                     // Registro de reproducciones
  USER_STATS: 'user_stats',           // Estadísticas por usuario
  SONG_STATS: 'song_stats',           // Estadísticas por canción
  DAILY_METRICS: 'daily_metrics',     // Métricas diarias agregadas
  RECOMMENDATIONS: 'recommendations',  // Recomendaciones generadas
  TRENDING: 'trending',               // Canciones en tendencia
};

/**
 * Índices recomendados para Firestore (crear manualmente en la consola):
 * 
 * Collection: plays
 * - userId (Ascending), timestamp (Descending)
 * - songId (Ascending), timestamp (Descending)
 * 
 * Collection: song_stats
 * - playCount (Descending), lastPlayedAt (Descending)
 * 
 * Collection: user_stats
 * - totalPlays (Descending), lastPlayedAt (Descending)
 */

export default {
  initFirestore,
  getFirestore,
  closeFirestore,
  checkFirestoreConnection,
  COLLECTIONS,
};