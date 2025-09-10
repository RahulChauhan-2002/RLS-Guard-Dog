const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Local modules
const connectDB = require('./src/config/db');

// Route imports
const authRoutes = require('./src/routes/auth');
const progressRoutes = require('./src/routes/progress');
const classroomRoutes = require('./src/routes/classroom');

const app = express();


// Configure CORS for specific origins
const corsOptions = {
  origin: process.env.clientUrl, 
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Built-in middleware for json
app.use(express.json({ limit: '10kb' })); // Limit request body size

// API Rate Limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter); 


// API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/classroom', classroomRoutes);




// Server Startup ---
const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully.');

    console.log(`server running on port no. ${process.env.PORT}`)
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); 
  }
};

startServer();

module.exports = app;