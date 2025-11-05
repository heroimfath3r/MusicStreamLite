// src/layouts/PublicLayout.jsx
import React from "react";

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-500 to-pink-500">
      {children}
    </div>
  );
};

export default PublicLayout;
