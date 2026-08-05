export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  const id = getRouterParam(event, 'id')
  
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: {
      subscriptions: { include: { plan: true }, orderBy: { createdAt: 'desc' } },
      locations: true,
      users: true,
      _count: { select: { users: true, staff: true, appointments: true, customers: true, locations: true } },
    }
  })
  
  if (!tenant) throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  return tenant
})
