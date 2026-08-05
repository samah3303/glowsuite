import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const query = getQuery(event)

  const where: any = { tenantId: auth.tenantId }
  
  if (query.locationId) where.locationId = String(query.locationId)
  if (query.staffId) where.staffId = String(query.staffId)
  
  if (query.startDate || query.endDate) {
    where.startTime = {}
    if (query.startDate) where.startTime.gte = new Date(String(query.startDate))
    if (query.endDate) where.startTime.lte = new Date(String(query.endDate))
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      customer: true,
      staff: true,
      location: true,
      items: true
    },
    orderBy: { startTime: 'asc' }
  })

  return appointments
})
