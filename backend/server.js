const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());

// Serve static files (for local/uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP to 300 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// --- NEW ROUTE CONNECTIONS ---
app.use('/api/states', require('./routes/stateRoutes'));
app.use('/api/places', require('./routes/placeRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Default route
app.get('/', (req, res) => {
    res.send('TravelBharat API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});