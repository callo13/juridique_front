import React from "react";
import FolderCard from "./FolderCard";
import Stats from "./Stats";

const Sidebar = ({ folders, onNewFolder, loading, deleteFolder, renameFolder, onAddDocument }) => {
  // Statistiques d'exemple (à remplacer par des props ou du state réel si besoin)
  const stats = { documents: folders.reduce((acc, f) => acc + (f.documents?.length || 0), 0), vectors: 0, mb: 340 };

  return (
    <aside className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Mes <br /> Dossiers</h2>
        <button
          className="ml-2 px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white font-semibold shadow-lg hover:-translate-y-1 transition transform backdrop-blur-md"
          onClick={onNewFolder}
        >
          + Nouveau dossier
        </button>
      </div>
      {/* Liste des dossiers */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {loading ? (
          <div className="text-center text-white/70 py-8">Chargement...</div>
        ) : (
          folders.map((folder) => (
            <FolderCard key={folder.id} folder={folder} onDelete={deleteFolder} onRename={renameFolder} onAddDocument={onAddDocument} />
          ))
        )}
      </div>
      {/* Stats en bas */}
      <div className="mt-6">
        <Stats documents={stats.documents} vectors={stats.vectors} mb={stats.mb} />
      </div>
    </aside>
  );
};

export default Sidebar; 