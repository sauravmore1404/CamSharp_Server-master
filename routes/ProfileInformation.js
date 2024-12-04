// routes/users.js (or wherever you define your routes)

const express = require('express');
const router = express.Router();
const JWT = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as necessary
const Product = require('../models/Booking');
const dotenv = require('dotenv');
dotenv.config();

// Dummy function to verify token and get user ID
const verifyToken = (token) => {
  try {
    const decoded = JWT.verify(token, process.env.JWT_Secret);
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

router.get('/information', async (req, res) => {
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

        // Return user data in the response, including email and gender
        res.status(200).json(user
            // name: user.name,
            // mobileNumber: user.mobileNumber,
            // email: user.email, // Include the email property here
            
        );
    } catch (error) {
        // Handle JWT verification errors
        return res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
    }
});


//get user data in user data  page 


// Fetch user booking details
router.get('/user-booking', async (req, res) => {
  
    try {
      const token = req.headers.authorization.split(' ')[1];
      const userId = verifyToken(token); // Verifying token and getting user ID
      
  
      const products = await Product.find({ user: userId }).populate('user');
      res.status(200).json(products);
    } catch (error) {
        
      res.status(500).json({ message: error.message });
    }
  });


module.exports = router;
