import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import './Chat.css';

const Chat = () => {
  const [currentChatId, setCurrentChatId] = useState(null);

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  const handleNewChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  return (
    <div className="chat-page">
      <Sidebar 
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
      />
      {currentChatId ? (
        <ChatWindow chatId={currentChatId} />
      ) : (
        <div className="welcome-screen">
          <h1>Vadona AI</h1>
          <p>Indian version of AI Assistant</p>
          <p className="subtitle">Select a chat or create a new one to get started</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
