const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser, createUser } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');

router.get('/', verifyToken, checkPermission('read'), getUsers);
router.post('/create', verifyToken, checkPermission('write'), createUser);
router.post('/update/:id', verifyToken, checkPermission('update'), updateUser);
router.post('/delete/:id', verifyToken, checkPermission('delete'), deleteUser);

module.exports = router;
