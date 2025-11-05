// src/pages/Library.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaThLarge, FaList, FaFilter } from 'react-icons/fa';
import SongCard from '../components/songCard.js';
import { songsAPI, usersAPI } from '../services/api.js';
import './Library.css';

const Library = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  const [sortBy, setSortBy] = useState('title'); // 'title', 'artist', 'duration'
  const [currentPlaying, setCurrentPlaying] = useState(null);

  // Cargar canciones al montar el componente
  useEffect(() => {
    loadSongs();
    loadFavorites();
  }, []);

  // Filtrar canciones cuando cambia la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (song.artist_name && song.artist_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (song.album_name && song.album_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredSongs(filtered);
    }
  }, [searchQuery, songs]);

  // Ordenar canciones cuando cambia el criterio
  useEffect(() => {
    const sorted = [...filteredSongs].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'artist':
          return (a.artist_name || '').localeCompare(b.artist_name || '');
        case 'duration':
          return a.duration - b.duration;
        default:
          return 0;
      }
    });
    setFilteredSongs(sorted);
  }, [sortBy]);

  const loadSongs = async () => {
    try {
      setLoading(true);
      const data = await songsAPI.getAll();
      setSongs(data);
      setFilteredSongs(data);
      setError(null);
    } catch (err) {
      console.error('Error loading songs:', err);
      setError('Error al cargar las canciones');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const data = await usersAPI.getFavorites();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };

  const handlePlay = async (song) => {
    setCurrentPlaying(song.song_id);
    console.log('Playing:', song);
    
    // Registrar reproducción
    try {
      await usersAPI.recordPlay({
        song_id: song.song_id,
        duration_played: 0,
        completed: false
      });
    } catch (err) {
      console.error('Error recording play:', err);
    }
  };

  const handleAddToFavorites = async (songId) => {
    try {
      const isFav = favorites.some(f => f.songId === songId);
      
      if (isFav) {
        await usersAPI.removeFavorite(songId);
        setFavorites(favorites.filter(f => f.songId !== songId));
      } else {
        await usersAPI.addFavorite(songId);
        await loadFavorites();
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const isFavorite = (songId) => {
    return favorites.some(f => f.songId === songId);
  };

  if (loading) {
    return (
      <div className="library-container">
        <div className="library-loading">
          <div className="spinner"></div>
          <p>Cargando canciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="library-container">
        <div className="library-error">
          <p>{error}</p>
          <button onClick={loadSongs}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="library-container">
      {/* Collage de fondo animado */}
      <div className="library-background">
        <div className="collage-grid">
          {songs.slice(0, 12).map((song, index) => (
            <motion.div
              key={index}
              className="collage-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0.3, 0.5, 0.3], 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 8,
                delay: index * 0.5,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              <img 
                src={song.cover_image_url || 'https://via.placeholder.com/200'} 
                alt="" 
              />
            </motion.div>
          ))}
        </div>
        <div className="collage-overlay"></div>
      </div>

      {/* Header de la biblioteca */}
      <div className="library-header">
        <motion.h1 
          className="library-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Canciones
        </motion.h1>
        <p className="library-count">{filteredSongs.length} canciones</p>
      </div>

      {/* Barra de búsqueda y controles */}
      <div className="library-controls">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar canciones, artistas o álbumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="view-controls">
          <button
            className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Vista en cuadrícula"
          >
            <FaThLarge />
          </button>
          <button
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Vista en lista"
          >
            <FaList />
          </button>
        </div>

        <div className="sort-controls">
          <FaFilter className="filter-icon" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="title">Ordenar por título</option>
            <option value="artist">Ordenar por artista</option>
            <option value="duration">Ordenar por duración</option>
          </select>
        </div>
      </div>

      {/* Grid de canciones */}
      <motion.div 
        className={`songs-grid ${viewMode}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {filteredSongs.length === 0 ? (
          <div className="no-results">
            <p>No se encontraron canciones</p>
          </div>
        ) : (
          filteredSongs.map((song) => (
            <SongCard
              key={song.song_id}
              song={song}
              onPlay={handlePlay}
              onAddToFavorites={handleAddToFavorites}
              isPlaying={currentPlaying === song.song_id}
              isFavorite={isFavorite(song.song_id)}
            />
          ))
        )}
      </motion.div>
    </div>
  );
};

export default Library;