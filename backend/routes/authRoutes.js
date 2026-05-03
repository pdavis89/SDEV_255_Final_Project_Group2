const express = require('express');
const authController = require('../controllers/authController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/status', authController.status);
router.post('/logout', authController.logout);
router.get('/professors', authenticate, requireRole('professor'), authController.getProfessors);

module.exports = router;
