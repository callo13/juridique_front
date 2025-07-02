import React, { useState } from 'react';
import MainLayout from './components/Layout/MainLayout';
import DocumentManager from './components/DocumentManager/DocumentManager';
import ChatContainer from './components/Chat/ChatContainer';

function App() {
  const [folders, setFolders] = useState([]);

  return (
    <MainLayout>
      <DocumentManager folders={folders} setFolders={setFolders} />
      <ChatContainer folders={folders} />
    </MainLayout>
  );
}

export default App;
