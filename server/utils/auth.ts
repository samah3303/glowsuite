import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { H3Event, getCookie } from 'h3'

export function getJwtSecret(): string {
  const config = useRuntimeConfig()
  const secret = config.jwtSecret || process.env.JWT_SECRET

  if (!secret || secret === 'fallback_secret' || secret === 'glowsuite-dev-secret-change-in-production-2026') {
    if (process.env.NODE_ENV === 'production') {
      throw createError({
        statusCode: 500,
        statusMessage: 'FATAL SECURITY CONFIGURATION: JWT_SECRET environment variable must be explicitly defined in production.'
      })
    }
    return 'glowsuite-dev-secret-change-in-production-2026'
  }
  return secret
}

export function getAuthCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  }
}

export function generateToken(payload: { userId: string, tenantId: string, role: string }): string {
  const secret = getJwtSecret()
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export function verifyToken(token: string): any {
  try {
    const secret = getJwtSecret()
    return jwt.verify(token, secret)
  } catch (e) {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function getAuthUser(event: H3Event) {
  const token = getCookie(event, 'glowsuite_token')
  if (!token) return null
  return verifyToken(token)
}

export function requireAuth(event: H3Event) {
  const user = getAuthUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return user
}
