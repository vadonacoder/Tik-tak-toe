const { Configuration, OpenAIApi } = require('openai');
const Chat = require('../models/Chat');

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

const createChat = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.userId;

    const chat = new Chat({
      userId,
      title: title || 'New Chat'
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const userId = req.user.userId;

    // Verify chat belongs to user
    const chat = await Chat.findById(chatId);
    if (!chat || chat.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Add user message
    chat.messages.push({
      _id: new require('mongoose').Types.ObjectId(),
      role: 'user',
      content: message
    });

    await chat.save();

    try {
      // Get AI response
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: chat.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 500,
        temperature: 0.7
      });

      const aiMessage = response.data.choices[0].message.content;

      // Add AI message
      chat.messages.push({
        _id: new require('mongoose').Types.ObjectId(),
        role: 'assistant',
        content: aiMessage
      });

      chat.updatedAt = new Date();
      await chat.save();

      res.json({
        message: aiMessage,
        chat
      });
    } catch (aiError) {
      // Fallback response if OpenAI fails
      const fallbackMessage = "I'm sorry, I couldn't process your request at the moment. Please try again later.";
      
      chat.messages.push({
        _id: new require('mongoose').Types.ObjectId(),
        role: 'assistant',
        content: fallbackMessage
      });

      chat.updatedAt = new Date();
      await chat.save();

      res.json({
        message: fallbackMessage,
        chat
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;

    const chat = await Chat.findById(chatId);
    if (!chat || chat.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;

    const chat = await Chat.findById(chatId);
    if (!chat || chat.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Chat.deleteOne({ _id: chatId });
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChat,
  sendMessage,
  getChats,
  getChat,
  deleteChat
};
