const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Payment
const PaymentSchema = new Schema({
  userBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  userProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  name: { 
    type: String,
    required: true 
  },
  productId: {
    type: String,
    required: true
  },
  bookingPaymentMode: { 
    type: String,
    required: false
  },
  returnPaymentMode: { 
    type: String,
    required: false
  },
  totalAmount: {
    type: Number,
    required: true
  },
  advanceAmount: { 
    type: Number, 
    required: true 
  },
  remainingAmount: { 
    type: Number,
    required: false
  },
  isBook: {
    type: Boolean,
    default: false // Default value is set to false
  },
  isReturn: {
    type: Boolean,
    default: false // Default value is set to false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model from the schema
const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
