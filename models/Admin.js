const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AdminSchema = new Schema({
name: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
     
   
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
  const Admin = mongoose.model('Admin', AdminSchema);
  module.exports = Admin;