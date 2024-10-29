const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');

router.get('/', verifyToken, checkPermission('read'), getUsers);
router.put('/:id', verifyToken, checkPermission('update'), updateUser);
router.delete('/:id', verifyToken, checkPermission('delete'), deleteUser);

module.exports = router;
