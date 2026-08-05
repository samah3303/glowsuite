import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { hashPassword, generateToken, getAuthCookieOptions } from '~/server/utils/auth'
import { enforceRateLimit } from '~/server/utils/rateLimit'

const registerSchema = z.object({
  salonName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  // SEC-02: Rate limit registration attempts (max 5 requests per 5 minutes per IP)
  enforceRateLimit(event, { maxRequests: 5, windowMs: 5 * 60 * 1000, keyPrefix: 'auth:register' })

  const body = await readValidatedBody(event, registerSchema.parse)

  const existingUser = await prisma.user.findUnique({
    where: { email: body.email }
  })

  if (existingUser) {
    throw createError({ statusCode: 400, statusMessage: 'Email already registered' })
  }

  const slug = body.salonName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const existingTenant = await prisma.tenant.findUnique({
    where: { slug }
  })

  const finalSlug = existingTenant ? `${slug}-${Date.now().toString().slice(-4)}` : slug

  const tenant = await prisma.tenant.create({
    data: {
      name: body.salonName,
      slug: finalSlug,
      locations: {
        create: {
          name: 'Main Location'
        }
      }
    }
  })

  const passwordHash = await hashPassword(body.password)

  const user = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: body.email,
      passwordHash,
      firstName: body.firstName,
      lastName: body.lastName,
      role: 'OWNER'
    }
  })

  const token = generateToken({ userId: user.id, tenantId: tenant.id, role: user.role })
  
  // SEC-03: Set cookie with secure flags
  setCookie(event, 'glowsuite_token', token, getAuthCookieOptions())

  return {
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug }
  }
})
