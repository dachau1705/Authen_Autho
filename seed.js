const mongoose = require('mongoose');
const Permission = require('./models/Permission');
const Role = require('./models/Role');
const User = require('./models/User');
const bcryptjs = require('bcryptjs')

require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); 
    }
};

connectDB();

const seedData = async () => {
    try {
        await Permission.deleteMany({});
        await Role.deleteMany({});
        await User.deleteMany({});

        const permissions = await Permission.insertMany([
            { name: 'read', description: 'Can read data' },
            { name: 'write', description: 'Can write data' },
            { name: 'delete', description: 'Can delete data' },
            { name: 'update', description: 'Can update data' },
            { name: 'manage_users', description: 'Can manage users' },
        ]);

        console.log('Permissions seeded:', permissions);

        const roles = await Role.insertMany([
            { name: 'admin', permissions: permissions.map((p) => p._id) },
            { name: 'editor', permissions: [permissions[0]._id, permissions[1]._id, permissions[3]._id] },
            { name: 'viewer', permissions: [permissions[0]._id] },
            { name: 'moderator', permissions: [permissions[0]._id, permissions[2]._id] },
            { name: 'super_admin', permissions: permissions.map((p) => p._id) },
        ]);

        console.log('Roles seeded:', roles);
        const hashedPassword = await bcryptjs.hash('password123', 10); 
        const users = await User.insertMany([
            { username: 'alice', password: hashedPassword, roles: [roles[0]._id] },
            { username: 'bob', password: hashedPassword, roles: [roles[1]._id] },
            { username: 'charlie', password: hashedPassword, roles: [roles[2]._id] },
            { username: 'dave', password: hashedPassword, roles: [roles[3]._id] },
            { username: 'eve', password: hashedPassword, roles: [roles[4]._id] },
        ]);

        console.log('Users seeded:', users);

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding data:', error);
        mongoose.connection.close();
    }
};

seedData();
