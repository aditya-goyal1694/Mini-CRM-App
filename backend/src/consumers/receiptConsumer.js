const redis = require('../utils/redis');
const { CommunicationLog } = require('../models');

const BATCH_SIZE = 20;

async function processReceipts() {
  let lastId = '0';
  while (true) {
    const res = await redis.xRead({ key: 'receipts_stream', id: lastId }, { COUNT: BATCH_SIZE, BLOCK: 2000 });
    if (res) {
      const updates = [];
      for (const msg of res[0].messages) {
        const { logId, status } = msg.message;
        updates.push({ logId, status });
        lastId = msg.id;
      }
      // Batch update the DB
      for (const { logId, status } of updates) {
        await CommunicationLog.update(
          { delivery_status: status },
          { where: { id: logId } }
        );
      }
    }
  }
}

processReceipts();