// user.controller.js
import User from '../models/user.model.js';
import Content from '../models/content.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export const createUser = async (req, res) => {
    const { name, nickName, addr, email, contact, password } = req.body;
    const profilePic = req.file ? req.file.filename : null;

    if (!name || !nickName || !addr || !email || !contact || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            _id: uuidv4(),
            name,
            nickName,
            addr,
            email,
            contact,
            password: hashedPassword,
            profilePic
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Email already in use' });
        }
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserInfo = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            name: user.name,
            nickName: user.nickName,
            email: user.email,
            addr: user.addr,
            contact: user.contact,
            profilePic: user.profilePic
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findOne({ _id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            name: user.name,
            nickName: user.nickName,
            email: user.email,
            addr: user.addr,
            contact: user.contact,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getUserProfile = async (req, res) => {
    const userId = req.params.id;

    try {
        const userProfile = await User.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'contents',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'contents'
                }
            }
        ]);

        if (userProfile.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(userProfile[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};