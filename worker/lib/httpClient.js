const axios = require('axios');
const axiosRetry = require('axios-retry');
const Bottleneck = require('bottleneck');

const client = axios.create({ timeout: 10000 });
axiosRetry(client, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: axiosRetry.isNetworkOrIdempotentRequestError,
});

// per provider rate-limiting
const limiter = new Bottleneck({ maxConcurrent: 5, minTime: 200 });

async function request(config) {
  return limiter.schedule(() => client.request(config));
}

module.exports = { client, request };
