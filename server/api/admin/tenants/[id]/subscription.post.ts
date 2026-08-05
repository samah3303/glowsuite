import { z } from 'zod'

const subSchema = z.object({
  planId: z.string()
})

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  
  const tenantId = getRouterParam(event, 'id')
  const body = await readValidatedBody(event, subSchema.parse)
  
  await prisma.subscription.updateMany({
    where: { tenantId, status: 'ACTIVE' },
    data: { status: 'CANCELLED', endDate: new Date() }
  })
  
  const subscription = await prisma.subscription.create({
    data: {
      tenantId: tenantId!,
      planId: body.planId,
      status: 'ACTIVE'
    }
  })
  
  return subscription
})
