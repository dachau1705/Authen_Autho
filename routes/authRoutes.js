const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST: Đăng ký người dùng
router.post('/register', register);

// POST: Đăng nhập người dùng
router.post('/login', login);

module.exports = router;
