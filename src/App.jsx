import React from 'react';
import MainLayout from './components/Layout/MainLayout';
import DocumentManager from './components/DocumentManager/DocumentManager';
import ChatContainer from './components/Chat/ChatContainer';

function App() {
  return (
    <MainLayout>
      <DocumentManager />
      <ChatContainer />
    </MainLayout>
  );
}

export default App;
