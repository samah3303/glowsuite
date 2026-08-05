import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const query = getQuery(event)

  const where: any = { tenantId: auth.tenantId, isActive: true }
  if (query.locationId) {
    where.locationId = String(query.locationId)
  }

  const staffList = await prisma.staff.findMany({
    where,
    include: {
      appointments: {
        where: { startTime: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) } }
      }
    }
  })

  const performance = staffList.map(staff => {
    const apts = staff.appointments
    const completed = apts.filter(a => a.status === 'COMPLETED')
    const revenue = completed.reduce((acc, a) => acc + a.totalAmount, 0)
    
    let completionRate = 0
    if (apts.length > 0) {
      completionRate = Math.round((completed.length / apts.length) * 100)
    }

    return {
      staffId: staff.id,
      staffName: staff.displayName,
      appointmentCount: apts.length,
      revenue,
      completionRate
    }
  })

  return performance.sort((a, b) => b.revenue - a.revenue)
})
