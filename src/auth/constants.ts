export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY || 'satisfa',
  expiresIn: process.env.JWT_EXPIRES_IN || '60s'
}