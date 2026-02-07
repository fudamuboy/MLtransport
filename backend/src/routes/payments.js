const express = require('express');
const router = express.Router();
const db = require('../db/pool');
const { v4: uuidv4 } = require('uuid');

// POST /api/payments - Create a payment
router.post('/', async (req, res) => {
    try {
        const { bookingId, amount, phoneNumber } = req.body;

        if (!bookingId || !amount || !phoneNumber) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Simulate payment processing (90% success rate for MVP)
        const isSuccess = Math.random() > 0.1;
        const status = isSuccess ? 'success' : 'failed';
        const transactionId = isSuccess ? `OM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : null;

        // Create payment record
        const result = await db.query(`
      INSERT INTO payments (booking_id, amount, phone_number, status, transaction_id, provider)
      VALUES ($1, $2, $3, $4, $5, 'orange_money')
      RETURNING *
    `, [bookingId, amount, phoneNumber, status, transactionId]);

        // If payment successful, update booking status
        if (isSuccess) {
            await db.query(`
        UPDATE bookings SET status = 'confirmed' WHERE id = $1
      `, [bookingId]);

            // Simulate SMS notification
            const bookingResult = await db.query(`
        SELECT b.code, b.passenger_phone, b.seats,
               r.from_city, r.to_city,
               t.departure_time,
               c.name as company_name
        FROM bookings b
        JOIN trips t ON b.trip_id = t.id
        JOIN routes r ON t.route_id = r.id
        JOIN companies c ON t.company_id = c.id
        WHERE b.id = $1
      `, [bookingId]);

            if (bookingResult.rows.length > 0) {
                const booking = bookingResult.rows[0];
                const departureDate = new Date(booking.departure_time);
                const smsMessage = `
${booking.company_name} ✅
Réservation confirmée

Code : ${booking.code}
Trajet : ${booking.from_city} → ${booking.to_city}
Date : ${departureDate.toLocaleDateString('fr-FR')} - ${departureDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
Siège : ${booking.seats.join(', ')}
Présentez ce code à l'embarquement.
        `;
                console.log('📱 SMS envoyé à +223', booking.passenger_phone);
                console.log(smsMessage);
            }
        }

        res.json({
            id: result.rows[0].id,
            bookingId: result.rows[0].booking_id,
            amount: result.rows[0].amount,
            status: result.rows[0].status,
            transactionId: result.rows[0].transaction_id,
            provider: result.rows[0].provider,
            createdAt: result.rows[0].created_at,
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

// POST /api/webhooks/payment - Payment webhook (for real integration)
router.post('/webhook', async (req, res) => {
    try {
        const { transactionId, status, bookingId } = req.body;

        // Update payment status
        await db.query(`
      UPDATE payments SET status = $1 WHERE transaction_id = $2
    `, [status, transactionId]);

        // Update booking status if payment successful
        if (status === 'success') {
            await db.query(`
        UPDATE bookings SET status = 'confirmed' WHERE id = $1
      `, [bookingId]);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

module.exports = router;
