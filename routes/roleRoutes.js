const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Route cho các chức năng CRUD của Role
router.post('/', roleController.createRole);          // Tạo role mới
router.get('/', roleController.getAllRoles);          // Lấy tất cả roles
router.get('/:id', roleController.getRoleById);       // Lấy role theo ID
router.put('/:id', roleController.updateRole);        // Cập nhật role theo ID
router.delete('/:id', roleController.deleteRole);     // Xóa role theo ID

module.exports = router;
