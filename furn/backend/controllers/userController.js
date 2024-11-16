import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Tạo token với thời gian hết hạn
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token hết hạn sau 1 giờ
};

// Đăng nhập
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id); // Tạo token

        // Gửi token trong cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Chỉ sử dụng HTTPS trong môi trường production
            maxAge: 3600000, // Thời gian sống của cookie (1 giờ)
            sameSite: 'None', // Đảm bảo cookie được gửi trong cross-site requests
        });

        res.json({ success: true, message: "Login successful" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error during login" });
    }
};

// Đăng ký người dùng
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // Kiểm tra người dùng đã tồn tại chưa
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Kiểm tra email hợp lệ và mật khẩu đủ mạnh
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a stronger password" });
        }

        // Băm mật khẩu trước khi lưu vào cơ sở dữ liệu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(user._id); // Tạo token

        // Gửi cookie với token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Chỉ sử dụng HTTPS trong môi trường production
            maxAge: 3600000, // Thời gian sống của cookie (1 giờ)
            sameSite: 'None',
        });

        res.json({ success: true, message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error during registration" });
    }
};

export { loginUser, registerUser };
