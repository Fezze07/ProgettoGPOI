import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET
const accessTokenExpiry = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? '15m'

if (!accessTokenSecret) {
  throw new Error('Missing JWT_ACCESS_TOKEN_SECRET environment variable')
}

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 12)
}

export const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash)
}

export const createRefreshToken = () => {
  return crypto.randomBytes(48).toString('hex')
}

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export const createAccessToken = (payload) => {
  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
  })
}

export const verifyAccessToken = (token) => {
  return jwt.verify(token, accessTokenSecret)
}
