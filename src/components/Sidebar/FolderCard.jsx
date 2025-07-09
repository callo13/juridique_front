import React, { useState, useRef } from "react";

const FolderCard = ({ folder, onDelete, onRename, onAddDocument }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(folder.name);
  const fileInputRef = useRef();

  const handleRename = () => {
    if (name && name !== folder.name) {
      onRename(folder.id, name);
    }
    setEditing(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onAddDocument(folder.id, file);
    }
    e.target.value = null; // reset input
  };

  return (
    <div className="bg-white bg-opacity-80 rounded-2xl shadow-lg p-4 mb-2 backdrop-blur-md hover:-translate-y-1 transition transform cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-xl">📁</span>
          {editing ? (
            <input
              className="font-semibold text-lg text-gray-800 bg-white bg-opacity-60 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              autoFocus
              onChange={e => setName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={e => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') { setName(folder.name); setEditing(false); }
              }}
            />
          ) : (
            <span
              className="font-semibold text-lg text-gray-800 hover:underline"
              onDoubleClick={() => setEditing(true)}
              title="Double-cliquez pour renommer"
            >
              {folder.name}
            </span>
          )}
        </div>
        <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-bold">{folder.documents?.length || 0}</span>
        <button
          className="ml-2 text-green-600 hover:text-green-800 text-lg font-bold px-2 py-1 rounded"
          title="Ajouter un document"
          onClick={() => fileInputRef.current.click()}
        >
          📄+
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold px-2 py-1 rounded"
          title="Supprimer le dossier"
          onClick={() => onDelete(folder.id)}
        >
          🗑️
        </button>
      </div>
      <div className="space-y-1">
        {folder.documents?.map((file, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm text-gray-700 bg-white bg-opacity-60 rounded-lg px-2 py-1 mt-1">
            <span className="truncate flex-1">{file.name}</span>
            <span className="ml-2 text-xs text-gray-400">{file.size}</span>
            <span className="ml-2 text-green-500 font-bold">{file.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderCard; 