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
          // 1. Create the order
          const order = await Order.create(data);

          // 2. Find customer and update aggregation data
          if (order && order.customerId) {
            // Use transaction if needed for strict consistency
            await Customer.increment(
              { visits: 1, total_spend: order.amount },
              { where: { id: order.customerId } }
            );
            // Set last_purchase_date to order_date
            await Customer.update(
              { last_purchase_date: order.order_date },
              { where: { id: order.customerId } }
            );
          }
        } catch (e) {
          console.error('Order consumer error:', e);
        }
        lastId = msg.id;
      }
    }
  }
}

// Start both consumers
processCustomers();
processOrders();