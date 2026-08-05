import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

const postSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal(''))
})

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const body = await readValidatedBody(event, postSchema.parse)

  const location = await prisma.location.create({
    data: {
      tenantId: auth.tenantId,
      name: body.name,
      address: body.address,
      city: body.city,
      phone: body.phone,
      email: body.email || null
    }
  })

  return location
})
