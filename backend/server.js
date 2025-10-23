const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const propertyRoutes = require('./routes/property');

const app = express();
const PORT = config.port;

// Middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'property-valuation-backend'
  });
});

// API Routes
app.use('/api/property', propertyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: config.nodeEnv === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Start server with automatic port fallback on EADDRINUSE
function startServer(port, attempts = 0) {
  const maxAttempts = 5;

  const server = app
    .listen(port, () => {
      console.log(`🚀 Backend server running on port ${port}`);
      console.log(`📊 Health check: http://localhost:${port}/health`);
      console.log(`🏠 Property valuation: http://localhost:${port}/api/property/estimate`);
    })
    .on('error', (err) => {
      if (err && err.code === 'EADDRINUSE' && attempts < maxAttempts) {
        const nextPort = port + 1;
        console.warn(`⚠️  Port ${port} is in use. Trying ${nextPort}...`);
        // give the previous attempt a moment and retry on next port
        setTimeout(() => startServer(nextPort, attempts + 1), 250);
      } else {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
      }
    });

  return server;
}

startServer(Number(PORT));

module.exports = app;
