// controllers/userController.js
const Role = require('../models/Role');
const User = require('../models/User');
const bcryptjs = require('bcryptjs')

const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('roles');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const updateUser = async (req, res) => {
    try {
        const body = req.body
        const role = await Role.findOne({ name: body.roles })
        const password = await bcryptjs.hash(body.newPassword, 10);
        const user = await User.findByIdAndUpdate(req.params.id, {
            roles: [role._id],
            password: password
        }, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

module.exports = { getUsers, updateUser, deleteUser };
