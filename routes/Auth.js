const express = require('express');
const bcrypt = require('bcrypt');
const JWT=require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

// Define signup routes here
router.post('/signup', async (req, res) => {
    const { name, mob_num, email, password, confirm_password,   } = req.body;
    try {
        if (!name || !mob_num || !password || !confirm_password ) {
            return res.status(400).json({
                message: "All fields are required except email",
                status: false
            });
        }

        if (password !== confirm_password) {
            return res.status(400).json({
                message: 'Password and Confirm Password must match',
                status: false
            });
        }

        const user = await User.findOne({ mobileNumber: mob_num });
        if (user) {
            return res.status(400).json({
                message: 'Mobile Number already exists',
                status: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            mobileNumber: mob_num,
            email,
            password: hashedPassword,
            
        });
        await newUser.save();
        return res.status(201).json({
            message: 'User created successfully',
            status: true
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Define login routes here
router.post('/login', async (req, res) => {
    const { mobileNumber, password } = req.body;
    try {
        if (!mobileNumber || !password) {
            return res.status(400).json({
                message: "Both fields are required",
                status: false
            });
        }

        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(404).json({
                message: "Mobile Number doesn't exist",
                status: false
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Password doesn't match",
                status: false
            });
        }

        const token = JWT.sign({ userId: user._id }, process.env.JWT_Secret, { expiresIn: '1h' });
             user.LoginCount +=1;
             await user.save()
        return res.status(200).json({
            message: "User logged in successfully",
            token,
            loginCount: user.LoginCount,
            status: true
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

//profile routes here
router.get('/profile', async (req, res) => {
    try {
        // Check if the authorization header is present
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Unauthorized: Missing authorization header' });
        }

        // Split the authorization header and retrieve the token
        const token = req.headers.authorization.split(' ')[1];
        
        // Verify and decode the JWT token
        const decodedToken = JWT.verify(token, process.env.JWT_Secret);

        // Fetch user data using the user ID from the decoded token
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Return user data in the response, including email
        res.status(200).json({
            name: user.name,
            mobileNumber: user.mobileNumber,
            email: user.email,
          
        });
    } catch (error) {
        // Handle JWT verification errors
        return res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
    }
});

module.exports = router;
