require('dotenv').config();
const express = require('express');
const cors = require('cors');

const customerRoutes = require('./routes/customer');
const orderRoutes = require('./routes/order');
const segmentsRoutes = require('./routes/segments');
const campaignRoutes = require('./routes/campaign');
const vendorRoutes = require('./routes/vendor');

const setupSwagger = require('./docs/swagger');

const { sequelize } = require('./models');

// Sync models (creates tables if they don't exist)
sequelize
.sync()
.then(() => console.log('Database connected!'))
.catch((err) => console.error('Sequelize sync error:', err));

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/segments', segmentsRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/dummy', vendorRoutes);


setupSwagger(app);

// Root route
app.get('/', (req, res) => res.send("Mini CRM API is running."));

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});