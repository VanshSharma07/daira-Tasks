const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const childRoutes = require('./routes/childRoutes');  // New routes
const testRoutes = require('./routes/testRoutes');    // New routes

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/DemoDB'; // MongoDB URI

// Connect to MongoDB
mongoose.connect(MONGODB_URI);
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// Enable CORS
// app.use(cors({
//     origin: 'http://localhost:5173', 
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
// }));
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = ['http://localhost:5173', 'https://jiveesha-frontend.vercel.app', 'https://sankalpxdaira.vercel.app'];
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));



// Body parsing middleware
app.use(express.json());

// Use routes
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', childRoutes); // Added child routes
app.use('/', testRoutes);  // Added test routes

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
