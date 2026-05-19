const db = require('../lib/db');
const cache = require('../lib/cache');

async function ensureAsset(symbol) {
  const s = symbol.toUpperCase();
  const res = await db.query('SELECT id FROM crypto_assets WHERE symbol = $1', [s]);
  if (res.rows.length) return res.rows[0].id;
  const ins = await db.query(
    'INSERT INTO crypto_assets (symbol, name, created_at, updated_at) VALUES ($1,$2,now(),now()) RETURNING id',
    [s, s]
  );
  return ins.rows[0].id;
}

async function getLatestPrice(symbol) {
  const key = `price:latest:${symbol.toUpperCase()}`;
  const cached = await cache.get(key);
  if (cached) return cached;

  const q = 'SELECT * FROM crypto_price_history WHERE symbol=$1 ORDER BY captured_at DESC LIMIT 1';
  const res = await db.query(q, [symbol.toUpperCase()]);
  if (res.rows.length) {
    await cache.set(key, res.rows[0], 15);
    return res.rows[0];
  }
  return null;
}

async function collectAndSave(normalized) {
  // normalized: { provider, symbol, price, market_cap, volume_24h, percent_change_24h, captured_at }
  const assetId = await ensureAsset(normalized.symbol);
  const q = `INSERT INTO crypto_price_history (asset_id, provider, symbol, price, market_cap, volume_24h, percent_change_24h, captured_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             ON CONFLICT DO NOTHING`;
  await db.query(q, [assetId, normalized.provider, normalized.symbol, normalized.price, normalized.market_cap, normalized.volume_24h, normalized.percent_change_24h, normalized.captured_at]);
  await cache.set(`price:latest:${normalized.symbol}`, normalized, 20);
}

module.exports = { getLatestPrice, collectAndSave };
