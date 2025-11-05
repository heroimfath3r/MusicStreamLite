// src/components/SongCard.js
import React, { useState } from 'react';
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaEllipsisH } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './songCard.css';

const SongCard = ({ song, onPlay, onAddToFavorites, isPlaying, isFavorite }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    setLocalFavorite(!localFavorite);
    if (onAddToFavorites) {
      await onAddToFavorites(song.song_id);
    }
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay(song);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="song-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="song-card-image-container">
        <img 
          src={song.cover_image_url || 'https://via.placeholder.com/200x200/1a1f3a/007AFF?text=No+Image'} 
          alt={song.title}
          className="song-card-image"
        />
        
        <div className="song-card-overlay">
          <button 
            className={`play-button ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlayClick}
          >
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
          </button>
        </div>

        <button 
          className={`favorite-button ${localFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          title={localFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {localFavorite ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
        </button>
      </div>

      <div className="song-card-info">
        <h3 className="song-title">{song.title}</h3>
        <p className="song-artist">{song.artist_name || 'Artista desconocido'}</p>
        <div className="song-meta">
          <span className="song-album">{song.album_name || 'Álbum desconocido'}</span>
          <span className="song-duration">{formatDuration(song.duration)}</span>
        </div>
      </div>

      <div className="song-card-actions">
        <button 
          className="menu-button"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FaEllipsisH size={16} />
        </button>

        {showMenu && (
          <div className="song-menu">
            <button onClick={() => console.log('Agregar a playlist')}>
              Agregar a playlist
            </button>
            <button onClick={() => console.log('Ver álbum')}>
              Ir al álbum
            </button>
            <button onClick={() => console.log('Ver artista')}>
              Ir al artista
            </button>
            <button onClick={handleFavoriteClick}>
              {localFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SongCard;

