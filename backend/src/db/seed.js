require('dotenv').config();
const { pool } = require('./pool');
const { v4: uuidv4 } = require('uuid');

// Mali regions data
const regionsData = [
    { name: 'Koulikoro', chefLieu: 'Koulikoro' },
    { name: 'Ségou', chefLieu: 'Ségou' },
    { name: 'Sikasso', chefLieu: 'Sikasso' },
    { name: 'Mopti', chefLieu: 'Mopti' },
    { name: 'Kayes', chefLieu: 'Kayes' },
    { name: 'Kita', chefLieu: 'Kita' },
    { name: 'Dioïla', chefLieu: 'Dioïla' },
    { name: 'Bougouni', chefLieu: 'Bougouni' },
    { name: 'Tombouctou', chefLieu: 'Tombouctou' },
    { name: 'Gao', chefLieu: 'Gao' },
    { name: 'Kidal', chefLieu: 'Kidal' },
    { name: 'Taoudénit', chefLieu: 'Taoudénit' },
];

// Routes data
const routesData = {
    'Koulikoro': { duration: '1h - 1h30', durationMin: 60, durationMax: 90, axis: 'RN27', distance: 60 },
    'Ségou': { duration: '3h - 4h', durationMin: 180, durationMax: 240, axis: 'RN6', distance: 235 },
    'Sikasso': { duration: '5h - 6h', durationMin: 300, durationMax: 360, axis: 'RN7', distance: 370 },
    'Mopti': { duration: '6h - 8h', durationMin: 360, durationMax: 480, axis: 'RN6', distance: 620 },
    'Kayes': { duration: '7h - 9h', durationMin: 420, durationMax: 540, axis: 'RN1', distance: 510 },
    'Kita': { duration: '3h - 4h', durationMin: 180, durationMax: 240, axis: 'RN1', distance: 180 },
    'Dioïla': { duration: '2h - 2h30', durationMin: 120, durationMax: 150, axis: 'RN7', distance: 120 },
    'Bougouni': { duration: '3h - 4h', durationMin: 180, durationMax: 240, axis: 'RN7', distance: 160 },
    'Tombouctou': { duration: '12h - 15h', durationMin: 720, durationMax: 900, axis: 'RN6', distance: 1000 },
    'Gao': { duration: '14h - 18h', durationMin: 840, durationMax: 1080, axis: 'RN6', distance: 1200 },
    'Kidal': { duration: '18h - 24h', durationMin: 1080, durationMax: 1440, axis: 'RN6', distance: 1500 },
    'Taoudénit': { duration: '24h - 30h', durationMin: 1440, durationMax: 1800, axis: 'RN6', distance: 1800 },
};

// Stops data
const stopsData = {
    'Ségou': [
        { name: 'Yirimadio', order: 1, isPause: false },
        { name: 'Baguinéda', order: 2, isPause: false },
        { name: 'Kasséla', order: 3, isPause: false },
        { name: 'Zantiguila', order: 4, isPause: false },
        { name: 'Fana', order: 5, isPause: true },
        { name: 'Konobougou', order: 6, isPause: false },
        { name: 'Boni', order: 7, isPause: false },
        { name: 'Cinzana Gare', order: 8, isPause: false },
        { name: 'Ségou', order: 9, isPause: false },
    ],
    'Koulikoro': [
        { name: 'Sotuba', order: 1, isPause: false },
        { name: 'Titibougou', order: 2, isPause: false },
        { name: 'Koulikoro', order: 3, isPause: false },
    ],
    'Sikasso': [
        { name: 'Yirimadio', order: 1, isPause: false },
        { name: 'Sénou', order: 2, isPause: false },
        { name: 'Bougoula', order: 3, isPause: false },
        { name: 'Ouélessébougou', order: 4, isPause: true },
        { name: 'Kourouba', order: 5, isPause: false },
        { name: 'Bougouni', order: 6, isPause: true },
        { name: 'Kolondiéba', order: 7, isPause: false },
        { name: 'Sikasso', order: 8, isPause: false },
    ],
    'Mopti': [
        { name: 'Yirimadio', order: 1, isPause: false },
        { name: 'Baguinéda', order: 2, isPause: false },
        { name: 'Fana', order: 3, isPause: true },
        { name: 'Ségou', order: 4, isPause: true },
        { name: 'San', order: 5, isPause: true },
        { name: 'Mopti', order: 6, isPause: false },
    ],
    'Kayes': [
        { name: 'Kati', order: 1, isPause: false },
        { name: 'Néguela', order: 2, isPause: false },
        { name: 'Kita', order: 3, isPause: true },
        { name: 'Toukoto', order: 4, isPause: false },
        { name: 'Mahina', order: 5, isPause: false },
        { name: 'Kayes', order: 6, isPause: false },
    ],
    'Kita': [
        { name: 'Kati', order: 1, isPause: false },
        { name: 'Néguela', order: 2, isPause: false },
        { name: 'Kita', order: 3, isPause: false },
    ],
    'Dioïla': [
        { name: 'Yirimadio', order: 1, isPause: false },
        { name: 'Sénou', order: 2, isPause: false },
        { name: 'Dioïla', order: 3, isPause: false },
    ],
    'Bougouni': [
        { name: 'Yirimadio', order: 1, isPause: false },
        { name: 'Sénou', order: 2, isPause: false },
        { name: 'Ouélessébougou', order: 3, isPause: true },
        { name: 'Bougouni', order: 4, isPause: false },
    ],
};

// Companies
const companiesData = [
    { name: 'Sewa Transport', logo: '🚌', rating: 4.5 },
    { name: 'Bani Transport', logo: '🚍', rating: 4.2 },
    { name: 'Balanzan Express', logo: '🚐', rating: 4.7 },
    { name: 'Kamilkoç', logo: '🚌', rating: 4.5 },
    { name: 'Mali Bus', logo: '🚍', rating: 4.2 },
    { name: 'Bary Express', logo: '🚐', rating: 4.7 },


];

// Prices per route
const pricesData = {
    'Koulikoro': 2500,
    'Ségou': 5000,
    'Sikasso': 7500,
    'Mopti': 12000,
    'Kayes': 15000,
    'Kita': 4500,
    'Dioïla': 3000,
    'Bougouni': 5000,
    'Tombouctou': 25000,
    'Gao': 30000,
    'Kidal': 35000,
    'Taoudénit': 45000,
};

async function seed() {
    console.log('🌱 Starting seed...');

    try {
        // Clean existing data
        console.log('🧹 Cleaning existing data...');
        await pool.query('TRUNCATE seats, trips, stops, routes, companies, regions CASCADE');

        // Insert regions
        console.log('📦 Creating regions...');
        const regions = {};
        for (const region of regionsData) {
            const result = await pool.query(
                'INSERT INTO regions (name, chef_lieu) VALUES ($1, $2) RETURNING id',
                [region.name, region.chefLieu]
            );
            regions[region.name] = result.rows[0].id;
        }

        // Insert companies
        console.log('🚌 Creating companies...');
        const companies = [];
        for (const company of companiesData) {
            const result = await pool.query(
                'INSERT INTO companies (name, logo, rating) VALUES ($1, $2, $3) RETURNING id',
                [company.name, company.logo, company.rating]
            );
            companies.push({ ...company, id: result.rows[0].id });
        }

        // Insert routes
        console.log('🚗 Creating routes...');
        const routes = {};
        for (const [regionName, routeInfo] of Object.entries(routesData)) {
            const regionId = regions[regionName];
            if (!regionId) continue;

            const result = await pool.query(
                `INSERT INTO routes (from_city, to_city, duration, duration_min, duration_max, axis, distance, region_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
                ['Bamako', regionName, routeInfo.duration, routeInfo.durationMin, routeInfo.durationMax, routeInfo.axis, routeInfo.distance, regionId]
            );
            routes[regionName] = { id: result.rows[0].id, ...routeInfo };
        }

        // Insert stops
        console.log('📍 Creating stops...');
        for (const [regionName, stops] of Object.entries(stopsData)) {
            const route = routes[regionName];
            if (!route) continue;

            for (const stop of stops) {
                await pool.query(
                    'INSERT INTO stops (route_id, name, stop_order, is_pause) VALUES ($1, $2, $3, $4)',
                    [route.id, stop.name, stop.order, stop.isPause]
                );
            }
        }

        // Create trips for next 7 days
        console.log('🎫 Creating trips and seats...');
        const departureTimes = ['06:00', '08:00', '10:00', '14:00', '16:00'];
        const today = new Date();

        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
            const tripDate = new Date(today);
            tripDate.setDate(tripDate.getDate() + dayOffset);
            const dateStr = tripDate.toISOString().split('T')[0];

            for (const [regionName, route] of Object.entries(routes)) {
                const basePrice = pricesData[regionName] || 5000;

                for (let companyIndex = 0; companyIndex < companies.length; companyIndex++) {
                    const company = companies[companyIndex];
                    const numDepartures = 3 - companyIndex; // 3, 2, 1 departures

                    for (let i = 0; i < numDepartures; i++) {
                        const departureTime = departureTimes[i];
                        const departureHour = parseInt(departureTime.split(':')[0]);
                        const durationHours = Math.floor((route.durationMin + route.durationMax) / 2 / 60);
                        const arrivalHour = (departureHour + durationHours) % 24;

                        const departure = new Date(`${dateStr}T${departureTime}:00`);
                        const arrival = new Date(`${dateStr}T${String(arrivalHour).padStart(2, '0')}:00:00`);
                        const price = basePrice + (companyIndex * 500) + (i * 250);

                        const tripResult = await pool.query(
                            `INSERT INTO trips (route_id, company_id, departure_time, arrival_time, price, bus_type)
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
                            [route.id, company.id, departure, arrival, price, 'Standard 40 places']
                        );
                        const tripId = tripResult.rows[0].id;

                        // Create 40 seats
                        const columns = ['A', 'B', 'C', 'D'];
                        for (let row = 1; row <= 10; row++) {
                            for (let colIdx = 0; colIdx < 4; colIdx++) {
                                const seatNumber = `${columns[colIdx]}${row}`;
                                await pool.query(
                                    'INSERT INTO seats (trip_id, number, row_num, column_num, status) VALUES ($1, $2, $3, $4, $5)',
                                    [tripId, seatNumber, row, colIdx + 1, 'available']
                                );
                            }
                        }
                    }
                }
            }
        }

        console.log('✅ Seed completed successfully!');
    } catch (error) {
        console.error('❌ Seed failed:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

seed();
