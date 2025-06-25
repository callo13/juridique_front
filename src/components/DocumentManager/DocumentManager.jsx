import React, { useState, useRef } from 'react';
import { Upload, File, Trash2, AlertCircle } from 'lucide-react';

const DocumentManager = () => {
  const [documents, setDocuments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5678/webhook/e354a619-0065-49c4-9a40-6ef3fb68d527', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error uploading file:', error);
      return false;
    }
  };

  const handleFiles = async (files) => {
    const newDocuments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      file: file
    }));

    setDocuments(prev => [...prev, ...newDocuments]);

    // Upload each file
    for (const doc of newDocuments) {
      setUploadStatus(prev => ({ ...prev, [doc.id]: 'uploading' }));
      const success = await uploadFile(doc.file);
      setUploadStatus(prev => ({ 
        ...prev, 
        [doc.id]: success ? 'success' : 'error' 
      }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Mes Documents Juridiques</h2>
      
      {/* Input file caché */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept=".pdf,.docx,.txt"
        className="hidden"
      />
      
      {/* Zone de dépôt */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Glissez vos documents ici ou cliquez pour sélectionner
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Formats acceptés : PDF, DOCX, TXT
        </p>
      </div>

      {/* Liste des documents */}
      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun document n'a été ajouté
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.size}</p>
                  {uploadStatus[doc.id] && (
                    <p className={`text-xs ${
                      uploadStatus[doc.id] === 'success' ? 'text-green-500' :
                      uploadStatus[doc.id] === 'error' ? 'text-red-500' :
                      'text-blue-500'
                    }`}>
                      {uploadStatus[doc.id] === 'uploading' ? 'Envoi en cours...' :
                       uploadStatus[doc.id] === 'success' ? 'Envoyé avec succès' :
                       'Erreur lors de l\'envoi'}
                    </p>
                  )}
                </div>
              </div>
              <button 
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(doc.id)}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Statistiques */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium text-gray-900 mb-3">Statistiques</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-blue-600">{documents.length}</p>
            <p className="text-sm text-gray-500">Documents</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-green-600">0</p>
            <p className="text-sm text-gray-500">Vecteurs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-purple-600">0 MB</p>
            <p className="text-sm text-gray-500">Stockage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManager; 