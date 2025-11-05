// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002/api';


// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// SONGS API
// ============================================
export const songsAPI = {
  // Obtener todas las canciones
  getAll: async (params = {}) => {
    const response = await api.get('/songs', { params });
    return response.data;
  },

  // Obtener canción por ID
  getById: async (id) => {
    const response = await api.get(`/songs/${id}`);
    return response.data;
  },

  // Buscar canciones
  search: async (query) => {
    const response = await api.get('/songs/search', { params: { q: query } });
    return response.data;
  },

  // Crear canción (admin)
  create: async (songData) => {
    const response = await api.post('/songs', songData);
    return response.data;
  },

  // Actualizar canción (admin)
  update: async (id, songData) => {
    const response = await api.put(`/songs/${id}`, songData);
    return response.data;
  },

  // Eliminar canción (admin)
  delete: async (id) => {
    const response = await api.delete(`/songs/${id}`);
    return response.data;
  },
};

// ============================================
// USERS API
// ============================================
export const usersAPI = {
  // Registro
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Obtener perfil
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // Agregar a favoritos
  addFavorite: async (songId) => {
    const response = await api.post('/users/favorites', { song_id: songId });
    return response.data;
  },

  // Obtener favoritos
  getFavorites: async () => {
    const response = await api.get('/users/favorites');
    return response.data;
  },

  // Eliminar de favoritos
  removeFavorite: async (songId) => {
    const response = await api.delete(`/users/favorites/${songId}`);
    return response.data;
  },

  // Registrar reproducción
  recordPlay: async (playData) => {
    const response = await api.post('/users/play', playData);
    return response.data;
  },

  // Obtener historial
  getHistory: async (params = {}) => {
    const response = await api.get('/users/history', { params });
    return response.data;
  },
};

// ============================================
// PLAYLISTS API
// ============================================
export const playlistsAPI = {
  // Obtener todas las playlists del usuario
  getAll: async () => {
    const response = await api.get('/playlists');
    return response.data;
  },

  // Crear playlist
  create: async (playlistData) => {
    const response = await api.post('/playlists', playlistData);
    return response.data;
  },

  // Obtener canciones de una playlist
  getSongs: async (playlistId) => {
    const response = await api.get(`/playlists/${playlistId}`);
    return response.data;
  },

  // Agregar canción a playlist
  addSong: async (playlistId, songId) => {
    const response = await api.post(`/playlists/${playlistId}/songs`, { song_id: songId });
    return response.data;
  },

  // Eliminar canción de playlist
  removeSong: async (playlistId, songId) => {
    const response = await api.delete(`/playlists/${playlistId}/songs/${songId}`);
    return response.data;
  },

  // Eliminar playlist
  delete: async (playlistId) => {
    const response = await api.delete(`/playlists/${playlistId}`);
    return response.data;
  },
};

// ============================================
// SEARCH API
// ============================================
export const searchAPI = {
  // Búsqueda general (todas las entidades)
  searchAll: async (query) => {
    const response = await api.get('/search', { params: { q: query } });
    return response.data;
  },

  // Buscar solo canciones
  searchSongs: async (query) => {
    const response = await api.get('/search/songs', { params: { q: query } });
    return response.data;
  },

  // Buscar solo artistas
  searchArtists: async (query) => {
    const response = await api.get('/search/artists', { params: { q: query } });
    return response.data;
  },

  // Buscar solo álbumes
  searchAlbums: async (query) => {
    const response = await api.get('/search/albums', { params: { q: query } });
    return response.data;
  },
};

export default api;