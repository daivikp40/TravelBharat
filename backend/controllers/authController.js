const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }

        // Validate email format (require proper TLD like .com, .in, .org etc.)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address (e.g. name@example.com)' });
        }

        // Validate phone format if provided
        if (phone && phone.trim()) {
            const cleanPhone = phone.replace(/[\s-]/g, '');
            const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
            if (!phoneRegex.test(cleanPhone)) {
                return res.status(400).json({ message: 'Please provide a valid 10-digit Indian phone number (e.g. +91 98765 43210)' });
            }
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create user (password is hashed by the pre-save hook in User model)
        const user = await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone || '',
            password
        });

        if (user) {
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                createdAt: user.createdAt,
                token: generateToken(user._id)
            });
        } else {
            return res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: messages.join('. ') });
        }
        // Handle duplicate key (email already exists)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check for user email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Use the model method to compare passwords
        const isMatch = await user.matchPassword(password);

        if (isMatch) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                createdAt: user.createdAt,
                token: generateToken(user._id)
            });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update allowed fields
        if (req.body.name) user.name = req.body.name.trim();
        if (req.body.phone !== undefined) user.phone = req.body.phone.trim();
        if (req.body.phone !== undefined && req.body.phone.trim()) {
            const cleanPhone = req.body.phone.replace(/[\s-]/g, '');
            const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
            if (!phoneRegex.test(cleanPhone)) {
                return res.status(400).json({ message: 'Please provide a valid 10-digit Indian phone number (e.g. +91 98765 43210)' });
            }
        }
        if (req.body.email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
            if (!emailRegex.test(req.body.email)) {
                return res.status(400).json({ message: 'Please provide a valid email address (e.g. name@example.com)' });
            }
            // Check for duplicate email
            const existing = await User.findOne({ email: req.body.email.toLowerCase(), _id: { $ne: user._id } });
            if (existing) {
                return res.status(400).json({ message: 'Email already in use by another account' });
            }
            user.email = req.body.email.trim().toLowerCase();
        }

        // Update password if provided
        if (req.body.password) {
            if (req.body.password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters' });
            }
            user.password = req.body.password; // pre-save hook will hash it
        }

        const updatedUser = await user.save();

        return res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            createdAt: updatedUser.createdAt,
            token: generateToken(updatedUser._id)
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: messages.join('. ') });
        }
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateProfile
};
