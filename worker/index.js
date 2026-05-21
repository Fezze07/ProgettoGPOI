require('dotenv').config();
const { collectOnce, startSchedule } = require('./jobs/collector');

const args = process.argv.slice(2);
const runOnce = args.includes('--once') || args.includes('once');

async function main() {
  if (runOnce) {
    await collectOnce();
    console.log('Crypto collection completed.');
    process.exit(0);
  }

  startSchedule();
}

main().catch((error) => {
  console.error('Worker startup failed:', error);
  process.exit(1);
});
