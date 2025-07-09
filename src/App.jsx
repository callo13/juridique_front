import React, { useState } from 'react';
import MainLayout from './components/Layout/MainLayout';
import DocumentManager from './components/DocumentManager/DocumentManager';
import ChatContainer from './components/Chat/ChatContainer';
import Sidebar from "./components/Sidebar/Sidebar";
import ChatArea from "./components/Chat/ChatArea";
import useFolders from "./hooks/useFiles";

function App() {
  const {
    folders,
    loading,
    addFolder,
    deleteFolder,
    renameFolder,
    uploadDocument,
    // deleteDocument, ...
  } = useFolders();
  const [selectedFolder, setSelectedFolder] = useState(null);

  React.useEffect(() => {
    if (folders.length > 0 && !selectedFolder) {
      setSelectedFolder(folders[0].id);
    }
  }, [folders, selectedFolder]);

  const handleNewFolder = async () => {
    const name = prompt("Nom du dossier :");
    if (name) await addFolder(name);
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      {/* Sidebar (400px) */}
      <aside className="w-[400px] max-w-full h-screen p-4">
        <Sidebar
          folders={folders}
          onNewFolder={handleNewFolder}
          loading={loading}
          deleteFolder={deleteFolder}
          renameFolder={renameFolder}
          onAddDocument={uploadDocument}
        />
      </aside>
      {/* Chat Area (flex) */}
      <main className="flex-1 flex flex-col h-screen p-6">
        <ChatArea
          folders={folders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
        />
      </main>
    </div>
  );
}

export default App;
