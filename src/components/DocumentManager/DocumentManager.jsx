import React, { useState, useRef } from 'react';
import { Upload, Trash2, Folder, File } from 'lucide-react';

const DocumentManager = () => {
  const [folders, setFolders] = useState([]); // [{id, name, documents: [{id, name, size, file, status}]}]
  const fileInputRefs = useRef({});

  // Créer un nouveau dossier
  const handleAddFolder = () => {
    const name = prompt('Nom du dossier :');
    if (!name) return;
    const newFolder = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      documents: [],
      open: true,
    };
    setFolders(prev => [...prev, newFolder]);
  };

  // Upload d'un document dans un dossier
  const handleFileSelect = async (e, folderId) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const docId = Math.random().toString(36).substr(2, 9);
      const newDoc = {
        id: docId,
        name: file.name,
        size: formatFileSize(file.size),
        file,
        status: 'uploading',
      };
      setFolders(prev => prev.map(f => f.id === folderId ? { ...f, documents: [...f.documents, newDoc] } : f));
      // Upload
      const formData = new FormData();
      formData.append('file', file);
      let success = false;
      try {
        const response = await fetch('http://localhost:8000/vectorize', {
          method: 'POST',
          body: formData,
        });
        success = response.ok;
      } catch {
        success = false;
      }
      setFolders(prev => prev.map(f => f.id === folderId ? {
        ...f,
        documents: f.documents.map(d => d.id === docId ? { ...d, status: success ? 'success' : 'error' } : d)
      } : f));
    }
  };

  // Supprimer un dossier
  const handleDeleteFolder = (folderId) => {
    setFolders(prev => prev.filter(f => f.id !== folderId));
  };

  // Supprimer un document
  const handleDeleteDocument = (folderId, docId) => {
    setFolders(prev => prev.map(f => f.id === folderId ? {
      ...f,
      documents: f.documents.filter(d => d.id !== docId)
    } : f));
  };

  // Toggle ouverture/fermeture dossier
  const handleToggleFolder = (folderId) => {
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, open: !f.open } : f));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-marine">Mes Dossiers</h2>
        <button
          className="bg-marine text-white px-4 py-2 rounded-lg shadow hover:bg-marine/90 transition-colors"
          onClick={handleAddFolder}
        >
          + Nouveau dossier
        </button>
      </div>
      <div className="bg-ivoire rounded-xl shadow-lg p-4 border border-marine/10">
        {folders.length === 0 ? (
          <div className="text-center py-8 text-marine/40">
            Aucun dossier créé. Cliquez sur "Nouveau dossier" pour commencer.
          </div>
        ) : (
          <ul className="space-y-4">
            {folders.map(folder => (
              <li key={folder.id} className="bg-white rounded-xl shadow border border-marine/10">
                <div className="flex items-center justify-between px-4 py-3 cursor-pointer select-none" onClick={() => handleToggleFolder(folder.id)}>
                  <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-marine/80" />
                    <span className="font-medium text-marine text-lg">{folder.name}</span>
                    <span className="text-xs text-marine/50">({folder.documents.length} document{folder.documents.length > 1 ? 's' : ''})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 rounded hover:bg-marine/10"
                      onClick={e => { e.stopPropagation(); fileInputRefs.current[folder.id]?.click(); }}
                      title="Ajouter un document"
                    >
                      <Upload className="h-5 w-5 text-marine/60" />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-red-100"
                      onClick={e => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                      title="Supprimer le dossier"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                    <input
                      type="file"
                      ref={el => fileInputRefs.current[folder.id] = el}
                      onChange={e => handleFileSelect(e, folder.id)}
                      multiple
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                    />
                  </div>
                </div>
                {folder.open && (
                  <ul className="pl-8 pr-4 pb-3 space-y-2">
                    {folder.documents.length === 0 ? (
                      <li className="text-marine/40 italic">Aucun document</li>
                    ) : (
                      folder.documents.map(doc => (
                        <li key={doc.id} className="flex items-center justify-between bg-ivoire rounded-lg px-3 py-2 border border-marine/10 shadow-sm">
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4 text-marine/60" />
                            <span className="text-marine font-medium">{doc.name}</span>
                            <span className="text-xs text-marine/50">({doc.size})</span>
                            {doc.status === 'uploading' && <span className="text-xs text-marine/60 ml-2">Envoi...</span>}
                            {doc.status === 'success' && <span className="text-xs text-green-600 ml-2">OK</span>}
                            {doc.status === 'error' && <span className="text-xs text-red-500 ml-2">Erreur</span>}
                          </div>
                          <button
                            className="p-1 rounded hover:bg-red-100"
                            onClick={() => handleDeleteDocument(folder.id, doc.id)}
                            title="Supprimer le document"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Statistiques */}
      <div className="bg-ivoire rounded-xl shadow p-4 border border-marine/10">
        <h3 className="font-medium text-marine mb-3">Statistiques</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-marine">{folders.reduce((acc, f) => acc + f.documents.length, 0)}</p>
            <p className="text-sm text-marine/50">Documents</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-green-600">0</p>
            <p className="text-sm text-marine/50">Vecteurs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-purple-600">0 MB</p>
            <p className="text-sm text-marine/50">Stockage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManager; 