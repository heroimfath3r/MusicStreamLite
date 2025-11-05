// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  const [loading, setLoading] = useState(false);

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

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const madeForYouItems = [
    { id: 1, title: "Mix: ¡Anímate!", color: "#FF6B6B" },
    { id: 2, title: "Mix: Concentración", color: "#4ECDC4" },
    { id: 3, title: "Mix: Relajante", color: "#45B7D1" },
    { id: 4, title: "Mix: Descubrimientos", color: "#96CEB4" },
    { id: 5, title: "Mix: Favoritos", color: "#FFEAA7" },
    { id: 6, title: "Mix: Nostalgia", color: "#DDA0DD" }
  ];

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Cargando tu música...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="home-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="home-header" variants={sectionVariants}>
        <h1>Inicio</h1>
      </motion.div>

      {/* Sección "Hecho para ti" */}
      <motion.section className="made-for-you-section" variants={sectionVariants}>
        <h2>Hecho para ti</h2>
        <div className="made-for-you-rect-grid">
          {madeForYouItems.map((item) => (
            <motion.div
              key={item.id}
              className="made-for-you-rect-card"
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              style={{ backgroundColor: item.color }}
            >
              <div className="made-for-you-rect-content">
                <h3>{item.title}</h3>
                <div className="made-for-you-rect-placeholder">
                  {/* Aquí luego colocaremos portada o mini preview */}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;
