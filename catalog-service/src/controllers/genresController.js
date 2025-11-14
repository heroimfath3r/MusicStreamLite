// catalog-service/src/controllers/genresController.js
// ✅ CONTROLADOR PARA GÉNEROS
// Este controlador hace llamadas a un servicio externo de géneros

import dotenv from 'dotenv';

dotenv.config();

// URL base de la API de géneros desde variables de entorno
const GENRES_API_URL = process.env.GENRES_API_URL || 'http://localhost:3002/api/genres';

// ============================================================
// GET /genres  → Obtiene todos los géneros musicales
// ============================================================
export const getGenres = async (req, res, next) => {
  try {
    const response = await fetch(GENRES_API_URL);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const genres = await response.json();
    res.status(200).json({
      success: true,
      data: genres
    });
  } catch (error) {
    console.error('❌ Error fetching genres:', error.message);
    next(error);
  }
};

// ============================================================
// GET /genres/:id  → Obtiene un género específico por ID
// ============================================================
export const getGenreById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await fetch(`${GENRES_API_URL}/${id}`);

    if (response.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Genre not found'
      });
    }

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const genre = await response.json();
    res.status(200).json({
      success: true,
      data: genre
    });
  } catch (error) {
    console.error('❌ Error fetching genre:', error.message);
    next(error);
  }
};

// ============================================================
// POST /genres  → Crea un nuevo género musical
// ============================================================
export const createGenre = async (req, res, next) => {
  try {
    const genreData = req.body;

    // Validación básica
    if (!genreData.name) {
      return res.status(400).json({
        success: false,
        message: 'The "name" field is required'
      });
    }

    const response = await fetch(GENRES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(genreData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        success: false,
        message: 'Error creating genre',
        error: errorData.message || 'Unknown error'
      });
    }

    const newGenre = await response.json();
    res.status(201).json({
      success: true,
      message: 'Genre created successfully',
      data: newGenre
    });
  } catch (error) {
    console.error('❌ Error creating genre:', error.message);
    next(error);
  }
};

// ============================================================
// PUT /genres/:id  → Actualiza un género existente
// ============================================================
export const updateGenre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const genreData = req.body;

    const response = await fetch(`${GENRES_API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(genreData)
    });

    if (response.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Genre not found'
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        success: false,
        message: 'Error updating genre',
        error: errorData.message || 'Unknown error'
      });
    }

    const updatedGenre = await response.json();
    res.status(200).json({
      success: true,
      message: 'Genre updated successfully',
      data: updatedGenre
    });
  } catch (error) {
    console.error('❌ Error updating genre:', error.message);
    next(error);
  }
};

// ============================================================
// DELETE /genres/:id  → Elimina un género por ID
// ============================================================
export const deleteGenre = async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await fetch(`${GENRES_API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Genre not found'
      });
    }

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    res.status(200).json({
      success: true,
      message: 'Genre deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting genre:', error.message);
    next(error);
  }
};