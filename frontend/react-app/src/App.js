import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Signup from './pages/Signup.js';
import Home from './pages/Home.js';
import Search from './pages/Search.js';
import Library from './pages/Library.js';
import Login from './pages/Login.js';

import Header from './components/Header.js';
import MusicPlayer from './components/MusicPlayer.js'
import PublicLayout from './components/PublicLayout.jsx';
import PrivateLayout from './components/PrivateLayout.jsx';

import './App.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

// 🔹 Este componente separa el Router de las animaciones
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        className="main-content"
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={pageTransition}
        key={location.pathname}
      >
        <Routes location={location} key={location.pathname}>
          {/* 🔸 Rutas públicas (sin Header ni MusicPlayer) */}
          <Route
            path="/signup"
            element={
              <PublicLayout>
                <Signup />
              </PublicLayout>
            }
          />
          {/* 🔸 Rutas privadas (con Header y MusicPlayer) */}
          <Route
            path="/"
            element={
              <PrivateLayout>
                <Home />
              </PrivateLayout>
            }
          />

          <Route element={<PrivateLayout />}>
  <Route path="/home" element={<Home />} />
  <Route path="/search" element={<Search />} />
  <Route path="/library" element={<Library />} />
</Route>
          <Route
            path="/library"
            element={
              <PrivateLayout>
                <Library />
              </PrivateLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            }
          />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;

