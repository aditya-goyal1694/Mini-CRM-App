const redis = require('../utils/redis');
const { Customer, Order } = require('../models');

const BATCH_SIZE = 10;

async function processCustomers() {
  let lastId = '0';
  while (true) {
    const res = await redis.xRead({ key: 'customers_stream', id: lastId }, { COUNT: BATCH_SIZE, BLOCK: 2000 });
    if (res) {
      for (const msg of res[0].messages) {
        const data = JSON.parse(msg.message.data);
        try {
          await Customer.create(data);
        } catch (e) { }
        lastId = msg.id;
      }
    }
  }
}

async function processOrders() {
  let lastId = '0';
  while (true) {
    const res = await redis.xRead({ key: 'orders_stream', id: lastId }, { COUNT: BATCH_SIZE, BLOCK: 2000 });
    if (res) {
      for (const msg of res[0].messages) {
        const data = JSON.parse(msg.message.data);
        try {
          await Order.create(data);
        } catch (e) { }
        lastId = msg.id;
      }
    }
  }
}

// Start both consumers
processCustomers();
processOrders();