// Server-side Alpha Vantage helper (used by API routes)
export async function fetchTicker(symbol) {
  const apiKey = process.env.ALPHA_VANTAGE_API
  if (!apiKey) throw new Error('ALPHA_VANTAGE_API is not set in environment variables')

  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol.toUpperCase()}&to_currency=USD&apikey=${apiKey}`

  const res = await fetch(url, { method: 'GET' })
  if (!res.ok) throw new Error(`Alpha Vantage HTTP error: ${res.status}`)
  const data = await res.json()

  if (data['Error Message']) {
    throw new Error(`Alpha Vantage Error: ${data['Error Message']}`)
  }
  if (data['Information'] && String(data['Information']).includes('rate limit')) {
    throw new Error(`Alpha Vantage Rate Limit: ${data['Information']}`)
  }

  const exchangeRateData = data['Realtime Currency Exchange Rate']
  if (!exchangeRateData) {
    throw new Error(`Invalid response from Alpha Vantage: ${JSON.stringify(data)}`)
  }

  const price = Number(exchangeRateData['5. Exchange Rate'] || 0)
  const capturedAt = exchangeRateData['6. Last Refreshed']
    ? new Date(exchangeRateData['6. Last Refreshed']).toISOString()
    : new Date().toISOString()

  return {
    provider: 'alphavantage',
    symbol: symbol.toUpperCase(),
    price: Number.isFinite(price) ? price : null,
    market_cap: null,
    volume_24h: null,
    percent_change_24h: null,
    captured_at: capturedAt,
  }
}
