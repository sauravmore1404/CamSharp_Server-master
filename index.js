const express = require("express");
const app = express();
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const adminRoutes =require('./routes/Admin');
const userRoutes = require('./routes/Auth');
const profileRoutes = require('./routes/ProfileInformation');
const BookingRoutes = require('./routes/BookingInformation');
const userOtpRoute = require('./routes/Otp');


// Middleware to handle CORS
app.use((req, res, next) => {
  const allowedOrigins = ["https://cam-sharp.vercel.app", "http://localhost:3000"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, auth-token");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
      res.sendStatus(204);
  } else {
      next();
  }
});


// Setting up port number
const PORT = process.env.PORT || 5000;

// Loading environment variables from .env file
dotenv.config();

// Connecting to database
database.connect();

// Middlewares
app.use(express.json());
app.use(cookieParser());


// decleare routes
app.use('/api/users',adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users', profileRoutes);
app.use('/api', BookingRoutes);
app.use('/api', userOtpRoute);
// Testing the server
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running ...",
    });
});

// Listening to the server
app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
});
