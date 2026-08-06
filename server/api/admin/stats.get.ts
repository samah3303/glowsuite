import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  
  const totalSalons = await prisma.tenant.count()
  const activeSalons = await prisma.tenant.count({ where: { status: 'ACTIVE' } })
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
    name: p.displayName,
    count: p._count.subscriptions
  }))

  const recentSalons = await prisma.tenant.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      subscriptions: {
        include: { plan: true },
        take: 1,
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  const formattedRecentSalons = recentSalons.map(s => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    status: s.status,
    createdAt: s.createdAt,
    plan: s.subscriptions[0]?.plan ? { name: s.subscriptions[0].plan.displayName } : null
  }))
  
  return {
    totalSalons,
    activeSalons,
    totalUsers,
    totalAppointments,
    totalRevenue,
    newTenantsThisMonth,
    tenantsByPlan,
    recentSalons: formattedRecentSalons
  }
})
