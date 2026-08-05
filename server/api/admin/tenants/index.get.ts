import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  
  const query = getQuery(event)
  const searchRaw = query.search as string | undefined
  const status = query.status as string | undefined
  
  const where: any = {}
  if (searchRaw && searchRaw.trim()) {
    // SEC-04: Sanitize search query input
    const cleanSearch = searchRaw.trim().replace(/[%_]/g, '\\$&')
    where.OR = [
      { name: { contains: cleanSearch } },
      { slug: { contains: cleanSearch } },
    ]
  }
  if (status) where.status = status
  
  const tenants = await prisma.tenant.findMany({
    where,
    include: {
      subscriptions: { include: { plan: true }, orderBy: { createdAt: 'desc' }, take: 1 },
      _count: { select: { users: true, staff: true, appointments: true, customers: true, locations: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  
  return tenants
})
