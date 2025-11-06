// src/pages/Settings.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaMusic,
  FaBell,
  FaLock,
  FaPalette,
  FaLanguage,
  FaVolumeMute,
  FaVolumeUp
} from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoPlay: true,
    highQuality: true,
    language: 'es',
    theme: 'dark',
    volume: 70
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <motion.div
      className="settings-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="settings-content">
        <motion.div
          className="settings-header"
          variants={cardVariants}
        >
          <h1 className="settings-title">Configuración</h1>
          <p className="settings-subtitle">Personaliza tu experiencia en MusicStream</p>
        </motion.div>

        {/* Reproducción */}
        <motion.div
          className="settings-section"
          variants={cardVariants}
        >
          <div className="section-header">
            <FaMusic className="section-icon" />
            <h2 className="section-title">Reproducción</h2>
          </div>

          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Reproducción automática</div>
                <div className="setting-description">
                  Continúa reproduciendo música similar cuando termine una lista
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoPlay}
                  onChange={() => handleToggle('autoPlay')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Calidad de audio alta</div>
                <div className="setting-description">
                  Transmite música con la mejor calidad disponible
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.highQuality}
                  onChange={() => handleToggle('highQuality')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">
                  {settings.volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                  Volumen predeterminado
                </div>
                <div className="setting-description">
                  Volumen: {settings.volume}%
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.volume}
                onChange={(e) => handleChange('volume', parseInt(e.target.value))}
                className="volume-slider"
              />
            </div>
          </div>
        </motion.div>

        {/* Notificaciones */}
        <motion.div
          className="settings-section"
          variants={cardVariants}
        >
          <div className="section-header">
            <FaBell className="section-icon" />
            <h2 className="section-title">Notificaciones</h2>
          </div>

          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Activar notificaciones</div>
                <div className="setting-description">
                  Recibe actualizaciones sobre nuevos lanzamientos y recomendaciones
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={() => handleToggle('notifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Apariencia */}
        <motion.div
          className="settings-section"
          variants={cardVariants}
        >
          <div className="section-header">
            <FaPalette className="section-icon" />
            <h2 className="section-title">Apariencia</h2>
          </div>

          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Tema</div>
                <div className="setting-description">
                  Elige el tema de la aplicación
                </div>
              </div>
              <select
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="settings-select"
              >
                <option value="dark">Oscuro</option>
                <option value="light">Claro</option>
                <option value="auto">Automático</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Idioma */}
        <motion.div
          className="settings-section"
          variants={cardVariants}
        >
          <div className="section-header">
            <FaLanguage className="section-icon" />
            <h2 className="section-title">Idioma y Región</h2>
          </div>

          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Idioma de la aplicación</div>
                <div className="setting-description">
                  Selecciona tu idioma preferido
                </div>
              </div>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="settings-select"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Privacidad */}
        <motion.div
          className="settings-section"
          variants={cardVariants}
        >
          <div className="section-header">
            <FaLock className="section-icon" />
            <h2 className="section-title">Privacidad y Seguridad</h2>
          </div>

          <div className="settings-group">
            <div className="setting-item">
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cambiar contraseña
              </motion.button>
            </div>

            <div className="setting-item">
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Gestionar datos personales
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;
