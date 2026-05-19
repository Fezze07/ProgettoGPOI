const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // consider adding ssl: { rejectUnauthorized: false } for some hosts
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
