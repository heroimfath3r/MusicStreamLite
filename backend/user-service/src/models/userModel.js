// src/models/userModel.js
import { pool } from '../config/database.js';

// Buscar usuario por email
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  return result.rows[0];
};

// Crear usuario
export const createUser = async (email, passwordHash, name, dateOfBirth, country) => {
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, name, date_of_birth, country, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING *`,
    [email.toLowerCase(), passwordHash, name, dateOfBirth || null, country || null]
  );
  return result.rows[0];
};

// Actualizar último login
export const updateLastLogin = async (userId) => {
  await pool.query(
    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1',
    [userId]
  );
};

// Obtener perfil
export const getUserProfile = async (userId) => {
  const result = await pool.query(
    `SELECT u.user_id, u.email, u.name, u.profile_image_url, u.date_of_birth,
            u.country, u.created_at, u.last_login,
            p.theme, p.language, p.auto_play, p.quality_preference
     FROM users u
     LEFT JOIN user_preferences p ON u.user_id = p.user_id
     WHERE u.user_id = $1`,
    [userId]
  );
  return result.rows[0];
};