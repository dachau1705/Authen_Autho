const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs')
const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username }).populate('roles');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const passwordMatch = await bcryptjs.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};



module.exports = { register, login };
