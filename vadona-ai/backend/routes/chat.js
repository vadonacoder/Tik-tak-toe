const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
  createChat,
  sendMessage,
  getChats,
  getChat,
  deleteChat
} = require('../controllers/chatController');

router.use(authenticateToken);

router.post('/', createChat);
router.get('/', getChats);
router.get('/:chatId', getChat);
router.post('/:chatId/message', sendMessage);
router.delete('/:chatId', deleteChat);

module.exports = router;
