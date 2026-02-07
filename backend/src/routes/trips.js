const express = require('express');
const router = express.Router();
const db = require('../db/pool');

// GET /api/trips - Get trips for a route and date
router.get('/', async (req, res) => {
    try {
        const { from = 'Bamako', to, date } = req.query;

        if (!to || !date) {
            return res.status(400).json({ error: 'Missing required parameters: to, date' });
        }

        // Search for routes in both directions
        const result = await db.query(`
      SELECT 
        t.*,
        r.from_city, r.to_city, r.duration, r.duration_min, r.duration_max, r.axis, r.distance,
        c.name as company_name, c.logo as company_logo, c.rating as company_rating,
        (SELECT COUNT(*) FROM seats s WHERE s.trip_id = t.id AND s.status = 'available') as available_seats,
        CASE 
          WHEN r.from_city = $1 AND r.to_city = $2 THEN false 
          ELSE true 
        END as is_reverse
      FROM trips t
      JOIN routes r ON t.route_id = r.id
      JOIN companies c ON t.company_id = c.id
      WHERE ((r.from_city = $1 AND r.to_city = $2)
         OR (r.from_city = $2 AND r.to_city = $1))
      AND DATE(t.departure_time) = $3
      ORDER BY t.departure_time
    `, [from, to, date]);

        const trips = result.rows.map(row => {
            // If it's a reverse route, swap from/to cities in the response
            const isReverse = row.is_reverse;
            return {
                id: row.id,
                routeId: row.route_id,
                route: {
                    id: row.route_id,
                    fromCity: isReverse ? row.to_city : row.from_city,
                    toCity: isReverse ? row.from_city : row.to_city,
                    duration: row.duration,
                    durationMin: row.duration_min,
                    durationMax: row.duration_max,
                    axis: row.axis,
                    distance: row.distance,
                },
                companyId: row.company_id,
                company: {
                    id: row.company_id,
                    name: row.company_name,
                    logo: row.company_logo,
                    rating: parseFloat(row.company_rating),
                },
                departureTime: row.departure_time,
                arrivalTime: row.arrival_time,
                price: row.price,
                busType: row.bus_type,
                availableSeats: parseInt(row.available_seats),
                totalSeats: 40,
            };
        });

        res.json(trips);
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
});

// GET /api/trips/:tripId - Get single trip
router.get('/:tripId', async (req, res) => {
    try {
        const { tripId } = req.params;

        const result = await db.query(`
      SELECT 
        t.*,
        r.from_city, r.to_city, r.duration, r.duration_min, r.duration_max, r.axis, r.distance,
        c.name as company_name, c.logo as company_logo, c.rating as company_rating
      FROM trips t
      JOIN routes r ON t.route_id = r.id
      JOIN companies c ON t.company_id = c.id
      WHERE t.id = $1
    `, [tripId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        const row = result.rows[0];
        const trip = {
            id: row.id,
            routeId: row.route_id,
            route: {
                id: row.route_id,
                fromCity: row.from_city,
                toCity: row.to_city,
                duration: row.duration,
                durationMin: row.duration_min,
                durationMax: row.duration_max,
                axis: row.axis,
                distance: row.distance,
            },
            companyId: row.company_id,
            company: {
                id: row.company_id,
                name: row.company_name,
                logo: row.company_logo,
                rating: parseFloat(row.company_rating),
            },
            departureTime: row.departure_time,
            arrivalTime: row.arrival_time,
            price: row.price,
            busType: row.bus_type,
        };

        res.json(trip);
    } catch (error) {
        console.error('Error fetching trip:', error);
        res.status(500).json({ error: 'Failed to fetch trip' });
    }
});

// GET /api/trips/:tripId/seats - Get seats for a trip
router.get('/:tripId/seats', async (req, res) => {
    try {
        const { tripId } = req.params;

        // First, release expired holds
        await db.query(`
      UPDATE seats SET status = 'available', hold_until = NULL
      WHERE trip_id = $1 AND status = 'held' AND hold_until < NOW()
    `, [tripId]);

        const result = await db.query(`
      SELECT * FROM seats
      WHERE trip_id = $1
      ORDER BY row_num, column_num
    `, [tripId]);

        const seats = result.rows.map(row => ({
            id: row.id,
            tripId: row.trip_id,
            number: row.number,
            row: row.row_num,
            column: row.column_num,
            status: row.status,
            holdUntil: row.hold_until,
        }));

        res.json(seats);
    } catch (error) {
        console.error('Error fetching seats:', error);
        res.status(500).json({ error: 'Failed to fetch seats' });
    }
});

// POST /api/trips/:tripId/hold - Hold seats temporarily
router.post('/:tripId/hold', async (req, res) => {
    try {
        const { tripId } = req.params;
        const { seatNumbers } = req.body;

        if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
            return res.status(400).json({ error: 'seatNumbers array is required' });
        }

        const holdUntil = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Check if seats are available
        const checkResult = await db.query(`
      SELECT number FROM seats
      WHERE trip_id = $1 AND number = ANY($2) AND status != 'available'
    `, [tripId, seatNumbers]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                error: 'Some seats are not available',
                unavailable: checkResult.rows.map(r => r.number)
            });
        }

        // Hold the seats
        await db.query(`
      UPDATE seats SET status = 'held', hold_until = $1
      WHERE trip_id = $2 AND number = ANY($3) AND status = 'available'
    `, [holdUntil, tripId, seatNumbers]);

        res.json({
            success: true,
            holdUntil: holdUntil.toISOString(),
            seats: seatNumbers
        });
    } catch (error) {
        console.error('Error holding seats:', error);
        res.status(500).json({ error: 'Failed to hold seats' });
    }
});

module.exports = router;
