import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar"; // ¡Importa el nuevo Sidebar!
import MusicPlayer from "./MusicPlayer";
import './PrivateLayout.css'; // Nuevo archivo CSS para el layout

const PrivateLayout = () => {
  return (
    <div className="apple-app-container">
      <Header />
      <div className="main-layout-content">
        <Sidebar />
        <main className="page-content-area">
          <Outlet /> {/* Aquí se renderizarán tus páginas (Home, Search, etc.) */}
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default PrivateLayout;