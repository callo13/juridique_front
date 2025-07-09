import { useState, useEffect, useRef } from "react";

export default function useFolders() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRefs = useRef({});

  // Récupérer dossiers et documents
  const fetchData = async () => {
    setLoading(true);
    try {
      const [foldersRes, documentsRes] = await Promise.all([
        fetch('http://localhost:8000/folders'),
        fetch('http://localhost:8000/documents'),
      ]);
      const foldersData = await foldersRes.json();
      const documentsData = await documentsRes.json();
      const foldersWithDocs = (foldersData || []).map((folder, idx) => ({
        id: folder.id || folder.name || idx.toString(),
        name: folder.name,
        open: true,
        documents: (documentsData || []).filter(doc => doc.folder_id === folder.id).map(doc => ({
          id: doc.id,
          name: doc.filename,
          size: doc.file_size,
          status: 'success',
        })),
      }));
      setFolders(foldersWithDocs);
    } catch (err) {
      setFolders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Ajouter un dossier
  const addFolder = async (name) => {
    if (!name) return;
    await fetch('http://localhost:8000/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    await fetchData();
  };

  // Supprimer un dossier
  const deleteFolder = async (folderId) => {
    await fetch(`http://localhost:8000/folders/${folderId}`, { method: 'DELETE' });
    await fetchData();
  };

  // Renommer un dossier
  const renameFolder = async (folderId, newName) => {
    await fetch(`http://localhost:8000/folders/${folderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    await fetchData();
  };

  // Upload d'un document (affichage immédiat + upload réel)
  const uploadDocument = async (folderId, file) => {
    const folder = folders.find(f => f.id === folderId);
    const folderName = folder ? folder.name : '';
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
    formData.append('folder_name', folderName);
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
    // Optionnel : re-fetch pour avoir l'id réel
    await fetchData();
  };

  // Supprimer un document
  const deleteDocument = async (folderId, docId) => {
    await fetch(`http://localhost:8000/documents/${docId}`, { method: 'DELETE' });
    await fetchData();
  };

  // Formatage taille fichier
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    folders,
    loading,
    fetchData,
    addFolder,
    deleteFolder,
    renameFolder,
    uploadDocument,
    deleteDocument,
    fileInputRefs,
    setFolders, // pour usage avancé
  };
} 