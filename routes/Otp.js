const express = require('express');
require('dotenv').config();

// const fast2sms = require('fast-two-sms');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();

const OTP = require('../models/OTP');

const product = require('../models/Booking');
const PaymentHistory = require('../models/PaymentHistory');


// Function to generate OTP
const generateOTPBook = () => {
    // Generate a 4-digit random OTP
    const OTP = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(" Book Otp is:", OTP);
    return OTP;
};

const generateOTPReturn = () => {
    // Generate a 4-digit random OTP
    const OTP = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(" Return Otp is:", OTP);
    return OTP;
};

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure :true,
    port:465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Route handler for generating OTP and sending it
router.post('/process-payment', async (req, res) => {
    try {
        const {_id } = req.body;
        const otp = generateOTPBook();



        const data = await product.findOne({_id, isSelected: true }).populate('user');

        if (!data) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const newOtp = await OTP({
            isOtp: otp,
        });
        await newOtp.save();


         // Send OTP via email
         const mailOptions = {
            from: process.env.EMAIL_USER,
            to: data.user.email, // Assuming the email is stored in the data object
            subject: ' Provided by Cam-sharp Your OTP Code :',
            text: `Thanks for trying our service. Your OTP for the Advance Payment is ${otp}.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP email:', error);
                return res.status(500).json({ error: 'Error sending OTP via email' });
            }
            console.log('Email sent:', info.response);
            res.status(200).json({ success: true, message: 'OTP sent successfully', otp });
        });

        //   // Fast2SMS configuration and send message
        //   const message = `Thanks for trying our service. Your OTP for the Advance Payment is ${otp}.`;
        //   const options = {
        //     authorization: process.env.FAST2SMS_API_KEY, // Ensure this is set in your environment variables
        //     message: message,
        //     numbers: [data.mobilenumber], // Assuming data has a mobileNumber field
        // };

        // fast2sms.sendMessage(options)
        //     .then((response) => {
        //         console.log(response);
        //     })
        //     .catch((error) => {
        //         console.error('Error sending OTP via Fast2SMS:', error);
        //         return res.status(500).json({ error: 'Error sending OTP via SMS' });
        //     });


        res.status(200).json({ success: true, message: 'OTP sent successfully', otp });

        // const message = `Thanks for trying our service. Your OTP for the Advance Payment  is ${otp}.`;

        // // Fast2SMS configuration and send message

        // var options = {
        //     authorization: process.env.FAST2SMS_API_KEY, // Ensure this is set in your environment variables
        //     message: message,
        //     numbers: ['8210811018'], // Phone numbers as an array
        // };
        // fast2sms.sendMessage(options).then((response) => {
        //     console.log(response);

        // })



    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



//Advance payment and otp verification

router.post('/boooking-otp-validation', async (req, res) => {
    const {      BookingOTP,
        _id,
        productId,
        totalAmount ,
        advanceAmount,mode} = req.body;

      

    try {
        // Extract the user's ID from req.user
        if (!BookingOTP || !totalAmount || !advanceAmount) {
            return res.status(400).json({
                message: "All fields are required",
                status: false
            });
        }
       

        const trimmedOtp = BookingOTP.trim();

        
        // Verify the OTP
        const VerifyOtp = await OTP.findOne({ isOtp: trimmedOtp });
       
        if (!VerifyOtp) {
            return res.status(404).json({
                error: ' Booking OTP not match',
                message:'Booking OTP not Match Can You try again ?',
                status:false
            });
        }

        await OTP.deleteOne({ isOtp: BookingOTP });

        const data = await product.findOne({ _id, isSelected: true });
        if (!data) {
            return res.status(404).json({ error: 'Booking not found' });
        }
      

        
        data.isBook = true;
        data.BookingCount += 1;
        await data.save();
        const newBookingData = await PaymentHistory({
            userBook:data.user,
           userProduct:data._id,
           name:data.ProductName,
           
           productId: productId,
             bookingPaymentMode: mode,
            totalAmount: totalAmount ,
            advanceAmount:  advanceAmount,

            isBook: true

        });
        await newBookingData.save();
        res.status(200).json({ success: true, message: 'OTP verify successfully', BookingOTP });
    } catch (error) {
        console.error('Error subminting booking OTP:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




// Route handler for generating OTP and sending it
router.post('/return-process-payment', async (req, res) => {
    try {
        const { _id } = req.body;
        const otp = generateOTPReturn();



        const data = await PaymentHistory.findOne({ userProduct:_id }).populate('userBook');

        if (!data) {
            return res.status(404).json({ error: 'product Id not found' });
        }

        const newOtp = await OTP({
            isOtp: otp,
        });
        await newOtp.save();

         // Send OTP via email
         const mailOptions = {
            from: process.env.EMAIL_USER,
            to: data.userBook.email, // Assuming the email is stored in the data object
            subject: ' Provided by Cam-sharp Your OTP Code :',
            text: `Thanks for trying our service. Your OTP for the remaining Amount is ${otp}.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP email:', error);
                return res.status(500).json({ error: 'Error sending OTP via email' });
            }
            console.log('Email sent:', info.response);
            res.status(200).json({ success: true, message: 'OTP sent successfully', otp });
        });


        res.status(200).json({ success: true, message: 'OTP sent successfully', otp });





    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//Remaing payment and otp verification

router.post('/return-otp-validation', async (req, res) => {
    const { returnOTP,  productId,_id, remaingAmount,mode } = req.body;
                
    try {
        // Extract the user's ID from req.user

        if (!returnOTP || !remaingAmount ) {
            return res.status(400).json({
                message: "All fields are required",
                status: false
            });
        }

        const trimmedOtp = returnOTP.trim();

        const VerifyOtp = await OTP.findOne({ isOtp:trimmedOtp });
       
        if (!VerifyOtp) {
            return res.status(404).json({
                error: 'Return OTP not match'
            });
        }
        
        await OTP.deleteOne({ isOtp:returnOTP });

        const data = await product.findOne({ productId: productId,_id, isSelected: true });
        if (!data) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        data.isReturn = true;
        data.ReturnCount += 1;
        await data.save();

        const returndata = await PaymentHistory.findOne({ productId: productId,userProduct:_id })


         returndata.returnPaymentMode = mode,

            returndata.remainingAmount = remaingAmount,

            returndata.isReturn = true
              

        await returndata.save();
        res.status(200).json({ success: true, message: 'OTP verify successfully', returnOTP });
    } catch (error) {
        console.error('Error subminting return OTP:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});






module.exports = router;
