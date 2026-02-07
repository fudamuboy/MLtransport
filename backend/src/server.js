require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routesRouter = require('./routes/routes');
const tripsRouter = require('./routes/trips');
const bookingsRouter = require('./routes/bookings');
const paymentsRouter = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/routes', routesRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Obilet Mali API running on http://localhost:${PORT}`);
});
