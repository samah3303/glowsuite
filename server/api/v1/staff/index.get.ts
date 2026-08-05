import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const query = getQuery(event)

  const where: any = { tenantId: auth.tenantId }
  if (query.locationId) {
    where.locationId = String(query.locationId)
  }

  const staff = await prisma.staff.findMany({
    where,
    include: {
      location: true,
      shifts: true,
      services: { include: { service: true } }
    },
    orderBy: { displayName: 'asc' }
  })

  return staff
})
