export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  
  const totalTenants = await prisma.tenant.count()
  const activeTenants = await prisma.tenant.count({ where: { status: 'ACTIVE' } })
  const totalUsers = await prisma.user.count()
  const totalAppointments = await prisma.appointment.count()
  
  const revenueResult = await prisma.payment.aggregate({
    where: { status: 'PAID' },
    _sum: { amount: true }
  })
  const totalRevenue = revenueResult._sum.amount || 0
  
  const startOfMonthDate = new Date()
  startOfMonthDate.setDate(1)
  startOfMonthDate.setHours(0, 0, 0, 0)
  
  const newTenantsThisMonth = await prisma.tenant.count({
    where: { createdAt: { gte: startOfMonthDate } }
  })
  
  const plans = await prisma.plan.findMany({
    include: { _count: { select: { subscriptions: { where: { status: 'ACTIVE' } } } } }
  })
  
  const tenantsByPlan = plans.map(p => ({
    planName: p.displayName,
    count: p._count.subscriptions
  }))
  
  return {
    totalTenants,
    activeTenants,
    totalUsers,
    totalAppointments,
    totalRevenue,
    newTenantsThisMonth,
    tenantsByPlan
  }
})
