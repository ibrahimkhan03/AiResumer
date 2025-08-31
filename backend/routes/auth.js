const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const {
  getCurrentUser,
  updateProfile,
  deleteAccount,
  getUserStats,
} = require('../controllers/authController');

const router = express.Router();

router.use(authenticateUser);

router.get('/me', getCurrentUser);
router.put('/profile', updateProfile);
router.delete('/account', deleteAccount);
router.get('/stats', getUserStats);

module.exports = router;