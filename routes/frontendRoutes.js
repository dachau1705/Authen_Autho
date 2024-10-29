const express = require('express');
const path = require('path');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { checkRoles, checkPermission } = require('../middleware/roleMiddleware');
const User = require('../models/User');

// Trang chính (index)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Trang đăng nhập
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Dashboard (yêu cầu đăng nhập)
router.get('/dashboard', verifyToken, checkPermission('read'), async (req, res) => {
    try {
        const userRoles = req.user;
        const user = await User.findById(userRoles.userId).populate('roles');

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(404).send('User not found');
        }

        console.log(user);
        res.send(`<h1>Welcome, ${user.username}</h1><p>You are logged in!</p>`);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Trang chỉ dành cho admin
router.get('/admin', verifyToken, checkRoles('admin'), (req, res) => {
    res.send('<h1>Admin Dashboard</h1><p>Only admins can access this page.</p>');
});

module.exports = router;
