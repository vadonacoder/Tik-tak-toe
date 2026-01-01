import React, { useState, useEffect } from 'react';
import { chatService } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import './Sidebar.css';
import { FiPlus, FiTrash2, FiMenu } from 'react-icons/fi';

const Sidebar = ({ onSelectChat, currentChatId, onNewChat }) => {
  const [chats, setChats] = useState([]);
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const response = await chatService.getChats();
      setChats(response.data);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await chatService.createChat('New Chat');
      setChats([response.data, ...chats]);
      onNewChat(response.data._id);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    try {
      await chatService.deleteChat(chatId);
      setChats(chats.filter(chat => chat._id !== chatId));
      if (currentChatId === chatId) {
        onNewChat(null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <div className={`sidebar ${showMenu ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h1>Vadona AI</h1>
        <button 
          className="menu-toggle"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FiMenu />
        </button>
      </div>

      <button className="new-chat-btn" onClick={handleNewChat}>
        <FiPlus /> New Chat
      </button>

      <div className="chats-list">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`chat-item ${currentChatId === chat._id ? 'active' : ''}`}
            onClick={() => onSelectChat(chat._id)}
          >
            <span className="chat-title">{chat.title}</span>
            <span className="chat-date">
              {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
            </span>
            <button
              className="delete-btn"
              onClick={(e) => handleDeleteChat(e, chat._id)}
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
