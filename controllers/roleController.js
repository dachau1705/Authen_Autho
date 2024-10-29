const Role = require('../models/Role');
const Permission = require('../models/Permission'); // Import nếu cần liên kết permission

// Tạo role mới
const createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        // Tạo role mới và lưu vào DB
        const newRole = new Role({ name, permissions });
        await newRole.save();

        res.status(201).json({ message: 'Role created successfully', role: newRole });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating role' });
    }
};

// Lấy danh sách tất cả các roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.status(200).json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching roles' });
    }
};

// Lấy role theo ID
const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id).populate('permissions');
        if (!role) return res.status(404).json({ error: 'Role not found' });

        res.status(200).json(role);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching role' });
    }
};

// Cập nhật role
const updateRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;
        const role = await Role.findByIdAndUpdate(
            req.params.id,
            { name, permissions },
            { new: true } // Trả về role mới sau khi cập nhật
        );

        if (!role) return res.status(404).json({ error: 'Role not found' });

        res.status(200).json({ message: 'Role updated successfully', role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating role' });
    }
};

// Xóa role
const deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) return res.status(404).json({ error: 'Role not found' });

        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting role' });
    }
};

module.exports = { createRole, getAllRoles, getRoleById, updateRole, deleteRole };
