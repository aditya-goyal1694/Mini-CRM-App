require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const orderRoutes = require('./routes/order');
const segmentsRoutes = require('./routes/segments');
const campaignRoutes = require('./routes/campaign');
const vendorRoutes = require('./routes/vendor');
const aiRoutes = require('./routes/ai');

const authenticateJWT = require('./middleware/jwt');

const setupSwagger = require('./docs/swagger');

const { sequelize } = require('./models');

// Sync models (creates tables if they don't exist)
sequelize
.sync()
.then(() => console.log('Database connected!'))
.catch((err) => console.error('Sequelize sync error:', err));

const app = express();
app.use(cors({
  origin: ['https://mini-crm-app-ten.vercel.app'],
  credentials: true,
}));

app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', authenticateJWT, customerRoutes);
app.use('/api/orders', authenticateJWT, orderRoutes);
app.use('/api/segments', authenticateJWT, segmentsRoutes);
app.use('/api/campaigns', authenticateJWT, campaignRoutes);
app.use('/api/ai', aiRoutes);

app.use('/dummy', vendorRoutes);

setupSwagger(app);

// Root route
app.get('/', (req, res) => res.send("Mini CRM API is running."));

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on render port:${port}`);
});