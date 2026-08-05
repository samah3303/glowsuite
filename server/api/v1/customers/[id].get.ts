import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const id = getRouterParam(event, 'id')

  const customer = await prisma.customer.findFirst({
    where: { id, tenantId: auth.tenantId },
    include: {
      appointments: {
        orderBy: { startTime: 'desc' },
        include: { staff: true, location: true, items: true }
      }
    }
  })

  if (!customer) {
    throw createError({ statusCode: 404, statusMessage: 'Customer not found' })
  }

  return customer
})
