import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { comparePassword, generateToken, getAuthCookieOptions } from '~/server/utils/auth'
import { enforceRateLimit } from '~/server/utils/rateLimit'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export default defineEventHandler(async (event) => {
  // SEC-02: Rate limit login attempts (max 10 requests per 1 minute per IP)
  enforceRateLimit(event, { maxRequests: 10, windowMs: 60 * 1000, keyPrefix: 'auth:login' })

  const body = await readValidatedBody(event, loginSchema.parse)

  const user = await prisma.user.findUnique({
    where: { email: body.email },
    include: { tenant: true }
  })

  if (!user || !(await comparePassword(body.password, user.passwordHash))) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  if (!user.tenantId && user.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 400, statusMessage: 'User has no tenant' })
  }

  const token = generateToken({ userId: user.id, tenantId: user.tenantId || '', role: user.role })
  
  // SEC-03: Set cookie with secure flags (httpOnly, sameSite: lax, secure in prod)
  setCookie(event, 'glowsuite_token', token, getAuthCookieOptions())

  return {
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    tenant: user.tenant ? { id: user.tenant.id, name: user.tenant.name, slug: user.tenant.slug } : null
  }
})
