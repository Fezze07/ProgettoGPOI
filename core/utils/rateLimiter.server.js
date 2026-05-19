import { RateLimiterMemory } from 'rate-limiter-flexible'

const authLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
})

export const getClientKey = (request) => {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    return xff.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || 'unknown-client'
}

export const rateLimitAuth = async (request) => {
  const key = getClientKey(request)
  await authLimiter.consume(key)
}
