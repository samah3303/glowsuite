import { H3Event, getRequestHeader } from 'h3'

interface RateLimitStore {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitStore>()

// Periodic cleanup of expired rate limit entries (every 5 mins)
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000)

export function enforceRateLimit(event: H3Event, options: { maxRequests: number; windowMs: number; keyPrefix?: string }) {
  const { maxRequests, windowMs, keyPrefix = 'global' } = options
  
  // Extract client IP address
  const forwarded = getRequestHeader(event, 'x-forwarded-for')
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : event.node.req.socket.remoteAddress || '127.0.0.1'
  const key = `${keyPrefix}:${clientIp}`
  const now = Date.now()

  let record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs }
    rateLimitMap.set(key, record)
    return
  }

  record.count++

  if (record.count > maxRequests) {
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000)
    event.node.res.setHeader('Retry-After', retryAfterSec)
    throw createError({
      statusCode: 429,
      statusMessage: `Too Many Requests. Please slow down and try again in ${retryAfterSec} seconds.`
    })
  }
}
