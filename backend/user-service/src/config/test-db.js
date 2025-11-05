import { pool } from './database.js';

(async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa:', result.rows[0]);
  } catch (err) {
    console.error('❌ Error al conectar:', err);
  } finally {
    pool.end();
  }
})();
