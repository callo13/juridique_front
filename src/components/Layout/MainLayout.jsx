import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-marine">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Colonne gauche - Gestion des documents (40%) */}
          <div className="w-full lg:w-2/5 bg-ivoire rounded-xl shadow-lg p-6">
            {children[0]}
          </div>
          
          {/* Colonne droite - Interface de chat (60%) */}
          <div className="w-full lg:w-3/5 bg-ivoire rounded-xl shadow-lg p-6">
            {children[1]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout; 