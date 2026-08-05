import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)

  const locations = await prisma.location.findMany({
    where: { tenantId: auth.tenantId },
    orderBy: { name: 'asc' }
  })

  return locations
})
