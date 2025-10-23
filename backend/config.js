module.exports = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true
  }
};
