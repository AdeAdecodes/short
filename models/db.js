// models/db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Create a pool of database connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Database URL should be in your .env file
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // SSL for production
});

// Export a function to query the database
module.exports = {
  query: (text, params) => pool.query(text, params),
};
