const cron = require('node-cron');
const binance = require('../services/cryptoProviders/binance');
const priceService = require('../services/priceService');

const DEFAULT_SYMBOLS = (process.env.COLLECT_SYMBOLS || 'BTC,ETH,BNB').split(',').map(s => s.trim().toUpperCase());

async function collectOnce(symbols = DEFAULT_SYMBOLS) {
  for (const s of symbols) {
    try {
      const payload = await binance.fetchTicker(s);
      await priceService.collectAndSave(payload);
      // optional: emit metrics/logging here
    } catch (err) {
      console.error('collector error for', s, err.message || err);
    }
  }
}

function startSchedule(cronExpr = process.env.COLLECT_CRON || '*/1 * * * *') {
  // default: every minute
  console.log('Starting price collector with schedule', cronExpr);
  cron.schedule(cronExpr, () => {
    collectOnce().catch(e => console.error('scheduled collect error', e));
  });
}

module.exports = { collectOnce, startSchedule };
