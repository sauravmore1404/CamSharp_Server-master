const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
      
    })
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.log("Database connection error: ", err));
};

module.exports = { connect };
