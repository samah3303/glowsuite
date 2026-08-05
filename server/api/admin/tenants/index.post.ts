import { z } from 'zod'
import bcrypt from 'bcryptjs'

const schema = z.object({
  name: z.string(),
  slug: z.string().optional(),
  ownerEmail: z.string().email(),
  ownerPassword: z.string().min(6),
  ownerFirstName: z.string(),
  ownerLastName: z.string(),
  planId: z.string().optional(),
  currency: z.string().default('USD'),
  timezone: z.string().default('UTC'),
})

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  
  const body = await readValidatedBody(event, schema.parse)
  const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  
  const tenant = await prisma.tenant.create({
    data: {
      name: body.name,
      slug,
      currency: body.currency,
      timezone: body.timezone,
      locations: {
        create: {
          name: 'Main Location',
        }
      },
      users: {
        create: {
          email: body.ownerEmail,
          passwordHash: bcrypt.hashSync(body.ownerPassword, 10),
          firstName: body.ownerFirstName,
          lastName: body.ownerLastName,
          role: 'OWNER'
        }
      },
      ...(body.planId ? {
        subscriptions: {
          create: {
            planId: body.planId,
          }
        }
      } : {})
    },
    include: {
      locations: true,
      users: true,
      subscriptions: true
    }
  })
  
  return tenant
})
