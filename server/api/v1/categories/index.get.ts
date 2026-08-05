import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)

  const categories = await prisma.category.findMany({
    where: { tenantId: auth.tenantId },
    orderBy: { sortOrder: 'asc' }
  })

  return categories
})
