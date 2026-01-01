const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/userController');

router.use(authenticateToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
