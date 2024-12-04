const express = require('express');
const router = express.Router();
const Product = require('../models/Booking');
const Payment = require('../models/PaymentHistory'); // Ensure correct path
const User = require('../models/User'); // Ensure correct path
 // Ensure correct path


const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
      

        const verified = jwt.verify(token, process.env.JWT_Secret);
        req.user = verified;
  

        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// Booking route
router.post('/booking', verifyToken, async (req, res) => {
    const { ProductName,ItemId, quantity, date, time, duration, location, Name, whatsappNo } = req.body;

    try {
        // Validate required fields
        if (!ItemId || !quantity || !date || !time || !duration || !location || !Name || !whatsappNo) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        console.log("All booking fields are filled");

        

        // Create new booking
        const newBooking = new Product({
            user: req.user.userId,
            isSelected:true,
            ProductName,
            productId: ItemId,
            quantity,
            date,
            time,
            duration,
            location,
            name: Name,
            mobilenumber: whatsappNo,
            createdAt: new Date()
        });

        // Save booking to the database
        const savedBooking = await newBooking.save();

        res.status(201).json({ message: 'Booking successful', booking: savedBooking });
    } catch (error) {
        console.error(error);
     
        res.status(500).json({ message: 'Server error' });
    }
});





//AdminSHow data

router.get('/admin', async (req, res) => {
    try {
        // Find a product where productId matches and isSelected is true
        const products = await Product.find({ isSelected: true });

        // Check if any product was found
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No product found with the given criteria' });
        }
       

        // Send the found products as a response
        res.json(products);
    } catch (error) {
        console.log('Error finding products:', error);
        // If an error occurs during the database query, send an error response
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/admin/payment', async (req, res) => {
    try {
        // Find a product where productId matches and isSelected is true
        const payment = await Payment.find({isBook:true});

        // Check if any product was found
        if (!payment || payment.length === 0) {
            return res.status(404).json({ message: 'No product found with the given criteria' });
        }
       

        // Send the found products as a response
        res.json(payment);
    } catch (error) {
        console.log('Error finding products:', error);
        // If an error occurs during the database query, send an error response
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/payment/:_id', async (req, res) => {
    const {_id}=req.params;
    try {
        // Find a product where productId matches and isSelected is true
        const payment = await Payment.findById({_id}).populate('userBook')
        .populate('userProduct');;

        // Check if any product was found
        if (!payment || payment.length === 0) {
            return res.status(404).json({ message: 'No product found with the given criteria' });
        }
       

        // Send the found products as a response
        res.json(payment);
    } catch (error) {
        console.log('Error finding products:', error);
        // If an error occurs during the database query, send an error response
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.put('/delete/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        // Find a product where productId matches and isSelected is true
        
        const product = await Product.findOneAndUpdate(
            { productId },
            { isSelected: false },
            { new: true } // Return the updated document
        );

        // Check if any product was found
        if (!product) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Send the found products as a response
        res.status(200).json(product);
    } catch (error) {
        console.log('Error finding products:', error);
        // If an error occurs during the database query, send an error response
        res.status(500).json({ message: 'Internal server error' });
    }
});








// Controller file (e.g., userBookingController.js)

router.get('/user-booking-details/:_id', async (req, res) => {
    const { _id } = req.params;
    try {
        const bookingDetails = await Product.findById({_id})
        .populate('user') // Populate userBook details
       
        // Populate userProduct details

    if (!bookingDetails) {
        return res.status(404).json({ error: 'Booking details not found' });
    }

    res.status(200).json(bookingDetails); // Return the booking details to the client// Return the booking details to the client
    } catch (error) {
        console.error('Error fetching booking details:', error);
        res.status(500).json({ error: 'Error fetching booking details2' }); // Return error message to the client
    }
});
// product data get element



router.get('/products', async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find({isSelected:true});

        // Check if any products were found
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        // Send the found products as a response
        res.json(products);
    } catch (error) {
        console.log('Error finding products:', error);
        // If an error occurs during the database query, send an error response
        res.status(500).json({ message: 'Internal server error' });
    }
});



 
  

module.exports = router;
