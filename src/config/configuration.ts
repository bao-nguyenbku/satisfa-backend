// Config Later
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  accessJwtSecret: process.env.ACCESS_JWT_SECRET_KEY,
  accessJwtExpireIn: process.env.ACCESS_JWT_EXPIRE_IN,
  refreshJwtSecret: process.env.REFRESH_JWT_SECRET_KEY,
  refreshJwtExpireIn: process.env.REFRESH_JWT_EXPIRE_IN,
  database: {
    states: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized',
    },
  },
  paypalClientId: process.env.PAYPAL_CLIENT_ID,
  paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  bcryptSaltRounds: 10,
  cloudinaryName: process.env.CLOUDINARY_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinarySecret: process.env.CLOUDINARY_SECRET,
  googleApiKey: process.env.GOOGLE_API_KEY,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleEmailUser: process.env.GOOGLE_EMAIL_USER,
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
});
