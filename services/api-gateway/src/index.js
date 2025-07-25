const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Microservice URLs (can be overridden by environment variables)
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'api-gateway',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Learning AWS Microservices API Gateway',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      products: '/api/products'
    }
  });
});

// Route: Users (proxy to user service)
app.use('/api/users', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${USER_SERVICE_URL}${req.originalUrl.replace('/api/users', '')}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('User service error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'User service unavailable',
      message: error.message
    });
  }
});

// Route: Products (proxy to product service)
app.use('/api/products', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${PRODUCT_SERVICE_URL}${req.originalUrl.replace('/api/products', '')}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Product service error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Product service unavailable',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
