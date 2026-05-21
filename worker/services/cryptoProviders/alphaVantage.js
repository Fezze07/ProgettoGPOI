const { request } = require('../../lib/httpClient');

async function fetchTicker(symbol) {
  const apiKey = process.env.ALPHA_VANTAGE_API;
  if (!apiKey) {
    throw new Error("ALPHA_VANTAGE_API is not set in environment variables");
  }

  // Alpha Vantage uses CURRENCY_EXCHANGE_RATE for crypto/fiat pairs
  // API Docs: https://www.alphavantage.co/documentation/#currency-exchange
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol.toUpperCase()}&to_currency=USD&apikey=${apiKey}`;

  const resp = await request({
    method: 'GET',
    url: url,
  });

  const data = resp.data || {};
  
  if (data["Error Message"]) {
    throw new Error(`Alpha Vantage Error: ${data["Error Message"]}`);
  }
  
  if (data["Information"] && data["Information"].includes("rate limit")) {
    throw new Error(`Alpha Vantage Rate Limit: ${data["Information"]}`);
  }

  const exchangeRateData = data["Realtime Currency Exchange Rate"];
  if (!exchangeRateData) {
    throw new Error(`Invalid response from Alpha Vantage: ${JSON.stringify(data)}`);
  }

  const price = exchangeRateData["5. Exchange Rate"];

  return {
    provider: 'alphavantage',
    symbol: symbol.toUpperCase(),
    price: price ? Number(price) : null,
    market_cap: null, // Not available in this endpoint
    volume_24h: null, // Not available in this endpoint
    percent_change_24h: null, // Not available in this endpoint
    captured_at: new Date().toISOString(),
  };
}

module.exports = { fetchTicker };
