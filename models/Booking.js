// product.js

const mongoose = require('mongoose');
const User=require('../models/User');

// Define the schema for the product
const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
      },
      ProductName: {
        type:String,
        required:false,
      },
  productId: {
    type: String,
    required: false,
   
  },
  quantity: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  mobilenumber: {
    type: String,
    required: true
  },
 
  isSelected:{
    type:Boolean,
    default:false
  },
  isBook: {
    type: Boolean,
    default: false // Default value is set to false
  },
  isReturn: {
    type: Boolean,
    default: false // Default value is set to false
  },
  BookingCount:{
    type:Number,
    default:0
  },
  ReturnCount:{
    type:Number,
    default:0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdTime: { type: String }
}, { timestamps: true });

// Middleware to set createdTime field
productSchema.pre('save', function(next) {
    const date = new Date(this.createdAt);
    this.createdTime = date.toISOString().split('T')[1].split('.')[0];
    next();
});

// Create the model from the schema
const Product = mongoose.model('Product', productSchema);

// Export the model
module.exports = Product;
