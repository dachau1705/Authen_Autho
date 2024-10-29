const express = require('express');
const path = require('path');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { checkRoles, checkPermission } = require('../middleware/roleMiddleware');
const User = require('../models/User');
const Role = require('../models/Role');

// Trang chính (index)
router.get('/', (req, res) => {
    const isLoggedIn = req.cookies.token ? true : false;
    res.render('index', { isLoggedIn });
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
        const roles = await Role.find({ _id: { $in: user.roles } }).populate('permissions');
        console.log(roles[0].permissions);

        const hasPermissionDel = roles.some((role) =>
            role.permissions.some((perm) => perm.name === 'delete')
        );

        const hasPermissionEdit = roles.some((role) =>
            role.permissions.some((perm) => perm.name === 'update')
        );

        const hasPermissionCreate = roles.some((role) =>
            role.permissions.some((perm) => perm.name === 'write')
        );

        const users = await User.find().populate('roles'); // Get the list of users
        res.render('dashboard', { users, hasPermissionEdit, hasPermissionDel, hasPermissionCreate }); // Pass users to the view
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Trang chỉ dành cho admin
router.get('/admin', verifyToken, checkRoles('admin'), (req, res) => {
    res.send('<h1>Admin Dashboard</h1><p>Only admins can access this page.</p>');
});

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});


module.exports = router;
