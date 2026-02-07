require('dotenv').config();
const { pool } = require('./pool');

const createTables = async () => {
    console.log('🔧 Creating database tables...');

    const sql = `
    -- Drop tables if they exist (in correct order for foreign keys)
    DROP TABLE IF EXISTS payments CASCADE;
    DROP TABLE IF EXISTS bookings CASCADE;
    DROP TABLE IF EXISTS seats CASCADE;
    DROP TABLE IF EXISTS trips CASCADE;
    DROP TABLE IF EXISTS stops CASCADE;
    DROP TABLE IF EXISTS routes CASCADE;
    DROP TABLE IF EXISTS companies CASCADE;
    DROP TABLE IF EXISTS regions CASCADE;

    -- Regions table
    CREATE TABLE regions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) UNIQUE NOT NULL,
      chef_lieu VARCHAR(100) NOT NULL
    );

    -- Companies table
    CREATE TABLE companies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) UNIQUE NOT NULL,
      logo VARCHAR(50),
      rating DECIMAL(2,1) DEFAULT 4.0
    );

    -- Routes table
    CREATE TABLE routes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      from_city VARCHAR(100) DEFAULT 'Bamako',
      to_city VARCHAR(100) NOT NULL,
      duration VARCHAR(50) NOT NULL,
      duration_min INTEGER NOT NULL,
      duration_max INTEGER NOT NULL,
      axis VARCHAR(20) NOT NULL,
      distance INTEGER NOT NULL,
      region_id UUID REFERENCES regions(id),
      UNIQUE(from_city, to_city)
    );

    -- Stops table (localités traversées)
    CREATE TABLE stops (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      stop_order INTEGER NOT NULL,
      is_pause BOOLEAN DEFAULT FALSE
    );

    -- Trips table
    CREATE TABLE trips (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      route_id UUID REFERENCES routes(id),
      company_id UUID REFERENCES companies(id),
      departure_time TIMESTAMP NOT NULL,
      arrival_time TIMESTAMP NOT NULL,
      price INTEGER NOT NULL,
      bus_type VARCHAR(100) DEFAULT 'Standard 40 places'
    );

    -- Seats table
    CREATE TABLE seats (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
      number VARCHAR(10) NOT NULL,
      row_num INTEGER NOT NULL,
      column_num INTEGER NOT NULL,
      status VARCHAR(20) DEFAULT 'available',
      hold_until TIMESTAMP,
      UNIQUE(trip_id, number)
    );

    -- Bookings table
    CREATE TABLE bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code VARCHAR(20) UNIQUE NOT NULL,
      trip_id UUID REFERENCES trips(id),
      passenger_name VARCHAR(200) NOT NULL,
      passenger_phone VARCHAR(20) NOT NULL,
      seats TEXT[] NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      total_amount INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Payments table
    CREATE TABLE payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id UUID UNIQUE REFERENCES bookings(id),
      amount INTEGER NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      provider VARCHAR(50) DEFAULT 'orange_money',
      phone_number VARCHAR(20) NOT NULL,
      transaction_id VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Indexes for performance
    CREATE INDEX idx_trips_route_id ON trips(route_id);
    CREATE INDEX idx_trips_departure ON trips(departure_time);
    CREATE INDEX idx_seats_trip_id ON seats(trip_id);
    CREATE INDEX idx_seats_status ON seats(status);
    CREATE INDEX idx_bookings_code ON bookings(code);
  `;

    try {
        await pool.query(sql);
        console.log('✅ Tables created successfully!');
    } catch (error) {
        console.error('❌ Error creating tables:', error);
        throw error;
    } finally {
        await pool.end();
    }
};

createTables();
