const { request } = require('../../lib/httpClient');

async function fetchTicker(symbol) {
  const pair = `${symbol.toUpperCase()}USDT`;
  const resp = await request({
    method: 'GET',
    url: `https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`,
  });
  const d = resp.data || {};
  return {
    provider: 'binance',
    symbol: symbol.toUpperCase(),
    price: d.lastPrice ? Number(d.lastPrice) : null,
    market_cap: null,
    volume_24h: d.volume ? Number(d.volume) : null,
    percent_change_24h: d.priceChangePercent ? Number(d.priceChangePercent) : null,
    captured_at: new Date().toISOString(),
  };
}

module.exports = { fetchTicker };
