import React, { useState, useRef, useEffect } from 'react';
import { chatService } from '../services/api';
import './ChatWindow.css';
import { FiSend } from 'react-icons/fi';

const ChatWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      loadChat();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = async () => {
    try {
      const response = await chatService.getChat(chatId);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatId) return;

    const userMessage = inputValue;
    setInputValue('');
    setLoading(true);

    try {
      const response = await chatService.sendMessage(chatId, userMessage);
      setMessages(response.data.chat.messages);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <h2>Vadona AI</h2>
            <p>Start a new conversation</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className={`message ${msg.role}`}>
              <div className="message-content">{msg.content}</div>
            </div>
          ))
        )}
        {loading && (
          <div className="message assistant">
            <div className="message-content loading">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Message Vadona AI..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !inputValue.trim()}>
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
