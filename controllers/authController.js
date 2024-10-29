const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs')
const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Mã hóa mật khẩu trước khi lưu
        const hashedPassword = await bcryptjs.hash(password, 10); // 10 là số vòng băm
        const newUser = new User({ username, password: hashedPassword }); // Sử dụng mật khẩu đã mã hóa
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
        // Tìm người dùng theo tên đăng nhập
        const user = await User.findOne({ username }).populate('roles');

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong DB
        const passwordMatch = await bcryptjs.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Tạo JWT token nếu đăng nhập thành công
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Lưu token vào cookie
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};



module.exports = { register, login };
