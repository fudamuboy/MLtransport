const express = require('express');
const router = express.Router();
const db = require('../db/pool');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');

// Generate booking code
const generateBookingCode = () => {
    const year = new Date().getFullYear();
    const num = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    return `YY-${year}-${num}`;
};

// POST /api/bookings - Create a booking
router.post('/', async (req, res) => {
    try {
        const { tripId, seats, passengerName, passengerPhone, totalAmount } = req.body;

        if (!tripId || !seats || !passengerName || !passengerPhone || !totalAmount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const code = generateBookingCode();

        // Create booking
        const result = await db.query(`
      INSERT INTO bookings (code, trip_id, passenger_name, passenger_phone, seats, total_amount, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *
    `, [code, tripId, passengerName, passengerPhone, seats, totalAmount]);

        // Update seats to occupied
        await db.query(`
      UPDATE seats SET status = 'occupied', hold_until = NULL
      WHERE trip_id = $1 AND number = ANY($2)
    `, [tripId, seats]);

        res.status(201).json({
            id: result.rows[0].id,
            code: result.rows[0].code,
            tripId: result.rows[0].trip_id,
            passengerName: result.rows[0].passenger_name,
            passengerPhone: result.rows[0].passenger_phone,
            seats: result.rows[0].seats,
            totalAmount: result.rows[0].total_amount,
            status: result.rows[0].status,
            createdAt: result.rows[0].created_at,
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// GET /api/bookings/:code - Get booking by code
router.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;

        const result = await db.query(`
      SELECT 
        b.*,
        t.departure_time, t.arrival_time, t.price, t.bus_type,
        r.from_city, r.to_city, r.duration, r.axis,
        c.name as company_name, c.logo as company_logo
      FROM bookings b
      JOIN trips t ON b.trip_id = t.id
      JOIN routes r ON t.route_id = r.id
      JOIN companies c ON t.company_id = c.id
      WHERE b.code = $1
    `, [code]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const row = result.rows[0];
        res.json({
            id: row.id,
            code: row.code,
            passengerName: row.passenger_name,
            passengerPhone: row.passenger_phone,
            seats: row.seats,
            totalAmount: row.total_amount,
            status: row.status,
            createdAt: row.created_at,
            trip: {
                departureTime: row.departure_time,
                arrivalTime: row.arrival_time,
                price: row.price,
                busType: row.bus_type,
                route: {
                    fromCity: row.from_city,
                    toCity: row.to_city,
                    duration: row.duration,
                    axis: row.axis,
                },
                company: {
                    name: row.company_name,
                    logo: row.company_logo,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

// GET /api/bookings/:code/pdf - Download PDF ticket
router.get('/:code/pdf', async (req, res) => {
    try {
        const { code } = req.params;

        const result = await db.query(`
      SELECT 
        b.*,
        t.departure_time, t.arrival_time, t.price, t.bus_type,
        r.from_city, r.to_city, r.duration, r.axis,
        c.name as company_name, c.logo as company_logo
      FROM bookings b
      JOIN trips t ON b.trip_id = t.id
      JOIN routes r ON t.route_id = r.id
      JOIN companies c ON t.company_id = c.id
      WHERE b.code = $1
    `, [code]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const booking = result.rows[0];

        // Create PDF
        const doc = new PDFDocument({ size: 'A5', margin: 40 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=billet-${code}.pdf`);

        doc.pipe(res);

        // Header
        doc.fontSize(24).fillColor('#FF6B00').text('Sewa Transport', { align: 'center' });
        doc.fontSize(12).fillColor('#666').text('Billet de transport', { align: 'center' });
        doc.moveDown(2);

        // Booking code
        const boxY = doc.y;
        doc.rect(40, boxY, doc.page.width - 80, 60).fill('#FFF7ED');
        doc.fillColor('#FF6B00').fontSize(14).text('Code de réservation', 50, boxY + 10, { align: 'center' });
        doc.fontSize(24).text(code, 50, boxY + 28, { align: 'center' });
        doc.y = boxY + 70;
        doc.moveDown();

        // Trip details
        doc.fillColor('#000').fontSize(12);
        doc.text(`Trajet: ${booking.from_city} - ${booking.to_city}`);
        doc.text(`Date: ${new Date(booking.departure_time).toLocaleDateString('fr-FR')}`);
        doc.text(`Heure de départ: ${new Date(booking.departure_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`);
        doc.text(`Durée: ${booking.duration}`);
        doc.moveDown();

        // Passenger
        doc.text(`Passager: ${booking.passenger_name}`);
        doc.text(`Téléphone: +223 ${booking.passenger_phone}`);
        doc.moveDown();

        // Seats
        doc.text(`Siège(s): ${booking.seats.join(', ')}`);
        doc.moveDown();

        // Total
        doc.fontSize(14).text(`Total: ${booking.total_amount.toLocaleString()} FCFA`, { align: 'right' });
        doc.moveDown(2);

        // Footer
        doc.fontSize(10).fillColor('#666').text('Présentez ce billet à l\'embarquement.', { align: 'center' });
        doc.text('Merci de voyager avec Sewa Transport!', { align: 'center' });

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

module.exports = router;
