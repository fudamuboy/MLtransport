const express = require('express');
const router = express.Router();
const db = require('../db/pool');

// GET /api/routes - Get all routes
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
      SELECT r.*, reg.name as region_name, reg.chef_lieu
      FROM routes r
      JOIN regions reg ON r.region_id = reg.id
      ORDER BY r.distance
    `);

        const routes = result.rows.map(row => ({
            id: row.id,
            fromCity: row.from_city,
            toCity: row.to_city,
            duration: row.duration,
            durationMin: row.duration_min,
            durationMax: row.duration_max,
            axis: row.axis,
            distance: row.distance,
            region: {
                name: row.region_name,
                chefLieu: row.chef_lieu,
            }
        }));

        res.json(routes);
    } catch (error) {
        console.error('Error fetching routes:', error);
        res.status(500).json({ error: 'Failed to fetch routes' });
    }
});

// GET /api/routes/:routeId/stops - Get stops for a route
router.get('/:routeId/stops', async (req, res) => {
    try {
        const { routeId } = req.params;

        const result = await db.query(`
      SELECT * FROM stops
      WHERE route_id = $1
      ORDER BY stop_order
    `, [routeId]);

        const stops = result.rows.map(row => ({
            id: row.id,
            routeId: row.route_id,
            name: row.name,
            order: row.stop_order,
            isPause: row.is_pause,
        }));

        res.json(stops);
    } catch (error) {
        console.error('Error fetching stops:', error);
        res.status(500).json({ error: 'Failed to fetch stops' });
    }
});

module.exports = router;
