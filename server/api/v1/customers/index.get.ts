import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const query = getQuery(event)

  const where: any = { tenantId: auth.tenantId }
  if (query.search && String(query.search).trim()) {
    // SEC-04: Sanitize search input to prevent SQL wildcard exploitation
    const cleanSearch = String(query.search).trim().replace(/[%_]/g, '\\$&')
    where.OR = [
      { name: { contains: cleanSearch } },
      { email: { contains: cleanSearch } },
      { phone: { contains: cleanSearch } }
    ]
  }

  const customers = await prisma.customer.findMany({
    where,
    include: {
      _count: {
        select: { appointments: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  return customers
})
