const { createClient } = require('redis');

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      // ~100 retries, waits 1s per retry
      if (retries > 100) return new Error('Too many retries to Redis');
      return 1000;
    }
  }
});

// Log errors and reconnect attempts
client.on('error', (err) => console.error('Redis Client Error:', err));
client.on('reconnecting', () => {
  console.log('Redis client is reconnecting...');
});

(async () => {
  try {
    if (!client.isOpen) await client.connect();
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

module.exports = client;