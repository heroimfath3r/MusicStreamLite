// src/pages/Profile.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaMusic,
  FaHeart,
  FaEdit,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Juan Pérez',
    email: 'juan@example.com',
    joinDate: 'Enero 2024',
    favoriteGenre: 'Rock',
    songsPlayed: 1250,
    favoriteSongs: 48
  });

  const [editedInfo, setEditedInfo] = useState(userInfo);

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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo(userInfo);
  };

  const handleSave = () => {
    setUserInfo(editedInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo(userInfo);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <motion.div
      className="profile-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="profile-content">
        {/* Header del Perfil */}
        <motion.div
          className="profile-header"
          variants={cardVariants}
        >
          <div className="profile-avatar-large">
            <FaUser size={60} />
          </div>

          <div className="profile-header-info">
            {isEditing ? (
              <input
                type="text"
                value={editedInfo.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="profile-name-input"
              />
            ) : (
              <h1 className="profile-name">{userInfo.name}</h1>
            )}

            <p className="profile-member-since">
              <FaCalendar /> Miembro desde {userInfo.joinDate}
            </p>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <motion.button
                className="btn-edit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEdit}
              >
                <FaEdit /> Editar perfil
              </motion.button>
            ) : (
              <div className="edit-actions">
                <motion.button
                  className="btn-save"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                >
                  <FaSave /> Guardar
                </motion.button>
                <motion.button
                  className="btn-cancel"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                >
                  <FaTimes /> Cancelar
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Información Personal */}
        <motion.div
          className="profile-section"
          variants={cardVariants}
        >
          <h2 className="section-title">Información Personal</h2>

          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">
                <FaEnvelope /> Email
              </div>
              {isEditing ? (
                <input
                  type="email"
                  value={editedInfo.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="info-input"
                />
              ) : (
                <div className="info-value">{userInfo.email}</div>
              )}
            </div>

            <div className="info-item">
              <div className="info-label">
                <FaMusic /> Género Favorito
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedInfo.favoriteGenre}
                  onChange={(e) => handleChange('favoriteGenre', e.target.value)}
                  className="info-input"
                />
              ) : (
                <div className="info-value">{userInfo.favoriteGenre}</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Estadísticas */}
        <motion.div
          className="profile-section"
          variants={cardVariants}
        >
          <h2 className="section-title">Estadísticas de Reproducción</h2>

          <div className="stats-grid">
            <motion.div
              className="stat-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-icon">
                <FaMusic />
              </div>
              <div className="stat-value">{userInfo.songsPlayed}</div>
              <div className="stat-label">Canciones reproducidas</div>
            </motion.div>

            <motion.div
              className="stat-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-icon">
                <FaHeart />
              </div>
              <div className="stat-value">{userInfo.favoriteSongs}</div>
              <div className="stat-label">Canciones favoritas</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
