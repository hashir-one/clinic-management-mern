const express = require('express');
const router = express.Router();
const {
  login,
  getMe,
  createStaffUser,
  getStaffUsers,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/login', loginLimiter, login);
router.get('/me', protect, getMe);

// Admin-only user management
router.route('/users')
  .post(protect, authorize('admin'), createStaffUser)
  .get(protect, authorize('admin'), getStaffUsers);

module.exports = router;
