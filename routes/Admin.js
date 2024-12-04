const express = require('express');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();
require('dotenv').config();

router.post('/admin-login', async (req, res) => {
    const { mobileNumber, password } = req.body;

    try {
        const data = await Admin.findOne({ mobileNumber });
      
        if (!data) {
            return res.status(404).json({
                message: 'Mobile number is not valid',
                status: false,
            });
        }
    
        const isMatch = await bcrypt.compare(password, data.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Password doesn't match",
                status: false
            });
        }  
        
        data.LoginCount += 1;
        data.name = 'Roshan Singh Deo';  // Ensure the name is a string
        await data.save();
        
        const token = JWT.sign({ userId: data._id }, process.env.JWT_Secret, { expiresIn: '1h' });

        return res.status(200).json({
            message: "User logged in successfully",
            token,
            status: true
        });
        
    } catch (error) {
        return res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});

module.exports = router;
