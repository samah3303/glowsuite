import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

const patchSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
  allergyInfo: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readValidatedBody(event, patchSchema.parse)

  const existing = await prisma.customer.findFirst({
    where: { id, tenantId: auth.tenantId }
  })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Customer not found' })
  }

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email || null,
      phone: body.phone,
      notes: body.notes,
      allergyInfo: body.allergyInfo
    }
  })

  return customer
})
