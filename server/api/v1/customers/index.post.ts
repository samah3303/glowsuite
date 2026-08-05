import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

const postSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
  allergyInfo: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const body = await readValidatedBody(event, postSchema.parse)

  const customer = await prisma.customer.create({
    data: {
      tenantId: auth.tenantId,
      name: body.name,
      email: body.email || null,
      phone: body.phone,
      notes: body.notes,
      allergyInfo: body.allergyInfo
    }
  })

  return customer
})
