const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
     
   
  },
  email: {
    type: String,
    required: false,
   
    
  },
  
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  LoginCount:{
    type:Number,
    default:0
  }
});

// Create the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
