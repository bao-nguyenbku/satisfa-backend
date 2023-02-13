// Config Later
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtExpireIn: process.env.JWT_EXPIRES_IN,
  database: {
    states: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized',
    },
  },
  bcryptSaltRounds: 10,
});
