export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  
  const plans = await prisma.plan.findMany({
    include: {
      _count: { select: { subscriptions: true } }
    },
    orderBy: { sortOrder: 'asc' }
  })
  
  return plans
})
