import React, { useState, useRef, useEffect } from 'react';
import { useSongStream } from '../hooks/useSongStream.js';
import { motion } from 'framer-motion';
import { 
  FaPlay, 
  FaPause, 
  FaStepBackward, 
  FaStepForward, 
  FaVolumeMute, 
  FaVolumeUp,
  FaHeart,
  FaRegHeart,
  FaListUl,
  FaRandom,
  FaRedoAlt
} from 'react-icons/fa';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);

  // Canción actual
  const [currentSong, setCurrentSong] = useState({
    id: 38,
    title: "Find Me",
    artist: "XXXTENTACION", 
    cover: "https://storage.googleapis.com/music-stream-lite-bucket/Cover-XXXTENTACION-Find-me.jpeg",
    streamUrl: "https://storage.googleapis.com/music-stream-lite-bucket/xxxtentacion-Find-Me.mp3"
  });

  // Obtener URL firmada automáticamente
  const { url: streamUrl, loading: urlLoading } = useSongStream(currentSong.id);
  console.log('🎵 MusicPlayer montado, currentSong.id:', currentSong.id, 'streamUrl:', streamUrl, 'loading:', urlLoading);
  useEffect(() => {
    // 1. Asegúrate de que tenemos la URL final y que no estamos cargando
    if (streamUrl && !urlLoading) {
        // 2. Establecer el nuevo src y cargar la media
        if (audioRef.current.src !== streamUrl) {
             audioRef.current.src = streamUrl;
             audioRef.current.load(); // Intenta forzar la carga de la nueva fuente

             // 3. Opcional: Si el usuario ya había pulsado Play o si quieres inicio automático
             if (isPlaying) { 
                 // Necesario debido a las políticas de Autoplay. Puede fallar si no hay interacción previa.
                 audioRef.current.play().catch(error => {
                    console.error("🚫 Falló el intento de Autoplay:", error);
                    // Podrías poner aquí un estado de error o un mensaje al usuario.
                 });
             }
        }
    }
}, [streamUrl, urlLoading]);

  // Sincronizar volumen con el audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Actualizar tiempo actual de reproducción
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Obtener duración cuando carga el audio
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Cambiar tiempo de reproducción
  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

 // Toggle play/pause
const togglePlayPause = () => {
    // Si la URL está cargando, aún así cambiamos el estado para que el useEffect intente el play cuando termine.
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // Si la URL está lista, intentamos tocar inmediatamente.
            // Si NO está lista, el useEffect lo intentará cuando lo esté.
            if (streamUrl && !urlLoading) {
                 audioRef.current.play().catch(error => {
                     console.error("🚫 Falló al intentar reproducir inmediatamente:", error);
                 });
            } else {
                 console.log('⏳ Intentando reproducir, pero la URL aún no está lista. Esperando el streamUrl...');
            }
        }
        setIsPlaying(!isPlaying);
    }
};

  // Cambiar volumen
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    setShuffleMode(!shuffleMode);
  };

  // Cambiar modo de repetición
  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  // Formatear tiempo en MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Cuando termina la canción
  const handleSongEnd = () => {
    if (repeatMode === 2) {
      // Repetir una canción
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      // Siguiente canción o parar
      setIsPlaying(false);
    }
  };

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const playButtonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.1 }
  };

  return (
    <motion.div 
      className="apple-music-player"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
     {/* Audio element */}
      <audio
        ref={audioRef}
        src={streamUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleSongEnd}
      />

      {/* Left side - Song info */}
      <div className="player-left">
        <motion.div 
          className="now-playing-cover"
          whileHover={{ scale: 1.05 }}
        >
          <img src={currentSong.cover} alt={currentSong.title} />
        </motion.div>

        <div className="now-playing-info">
          <div className="now-playing-title">{currentSong.title}</div>
          <div className="now-playing-artist">{currentSong.artist}</div>
        </div>

        <motion.button
          className={`like-btn ${isFavorite ? 'liked' : ''}`}
          onClick={() => setIsFavorite(!isFavorite)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </motion.button>
      </div>

      {/* Center - Controls and progress */}
      <div className="player-center">
        <div className="player-controls">
          <motion.button
            className={`control-btn ${shuffleMode ? 'active' : ''}`}
            onClick={toggleShuffle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Aleatorio"
          >
            <FaRandom size={16} />
          </motion.button>

          <motion.button
            className="control-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Anterior"
          >
            <FaStepBackward size={18} />
          </motion.button>

          <motion.button
            className="play-pause-btn"
            onClick={togglePlayPause}
            variants={playButtonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
          </motion.button>

          <motion.button
            className="control-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Siguiente"
          >
            <FaStepForward size={18} />
          </motion.button>

          <motion.button
            className={`control-btn ${repeatMode !== 0 ? 'active' : ''}`}
            onClick={toggleRepeat}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={repeatMode === 0 ? 'Sin repetición' : repeatMode === 1 ? 'Repetir todo' : 'Repetir uno'}
          >
            <FaRedoAlt size={16} />
            {repeatMode === 2 && <span className="repeat-one">1</span>}
          </motion.button>
        </div>

        <div className="progress-container">
          <span className="time-current">{formatTime(currentTime)}</span>
          <motion.input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="progress-bar"
            whileHover={{ scaleY: 1.5 }}
          />
          <span className="time-total">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right side - Volume and extras */}
      <div className="player-right">
        <motion.button
          className="player-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Cola"
        >
          <FaListUl size={18} />
        </motion.button>

        <div className="volume-control">
          <motion.button
            className="volume-btn"
            onClick={toggleMute}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMuted || volume === 0 ? (
              <FaVolumeMute size={16} />
            ) : (
              <FaVolumeUp size={16} />
            )}
          </motion.button>

          <motion.input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-bar"
            whileHover={{ scaleY: 1.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;