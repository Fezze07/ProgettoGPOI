const db = require('./worker/lib/db');

async function migrate() {
  try {
    await db.query(`
      CREATE OR REPLACE VIEW latest_crypto_prices AS
      SELECT DISTINCT ON (symbol)
        symbol,
        price,
        percent_change_24h,
        captured_at
      FROM crypto_price_history
      ORDER BY symbol, captured_at DESC;
    `);
    console.log("View created successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

migrate();
