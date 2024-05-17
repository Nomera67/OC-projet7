const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Controller to sign up of new user
exports.signup = async (req, res) => {
    try {
        // Get e mail and password to create an user
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        res.status(201).json({ message: "User successfully registered!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to log an user
exports.login = async (req, res) => {
    try {
        // Get e mail and password 
        const { email, password } = req.body;
        // Try to find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Authentification failed" });
        }

        // When user is find, comparision of password between form and the database
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Authentification failed" });
        }

        // Create an user token with 1 hour expiration
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ userId: user._id, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
