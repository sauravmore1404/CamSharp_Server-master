const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    
    isOtp: {
        type: String,
        
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // OTP will be deleted automatically after 5 minutes
    }
});

module.exports = mongoose.model('OTP', OTPSchema);
