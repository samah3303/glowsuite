import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)

  const categories = await prisma.category.findMany({
    where: { tenantId: auth.tenantId },
    include: {
      services: {
        where: { isActive: true },
        include: { staff: true }
      }
    },
    orderBy: { sortOrder: 'asc' }
  })

  return categories
})
