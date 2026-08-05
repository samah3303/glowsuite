import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const query = getQuery(event)
  const period = String(query.period || 'daily')
  const locationId = query.locationId ? String(query.locationId) : undefined

  // Define date range based on period
  let startDate = new Date()
  let groupCount = 7

  if (period === 'daily') {
    startDate.setDate(startDate.getDate() - 7)
    groupCount = 7
  } else if (period === 'weekly') {
    startDate.setDate(startDate.getDate() - 28)
    groupCount = 4
  } else if (period === 'monthly') {
    startDate.setMonth(startDate.getMonth() - 6)
    groupCount = 6
  }

  const baseWhere: any = { 
    tenantId: auth.tenantId,
    status: { notIn: ['CANCELLED'] },
    startTime: { gte: startDate }
  }
  if (locationId) baseWhere.locationId = locationId

  const appointments = await prisma.appointment.findMany({
    where: baseWhere,
    orderBy: { startTime: 'asc' }
  })

  // Grouping logic (simplified)
  const dataMap = new Map<string, number>()
  
  appointments.forEach(apt => {
    let key = ''
    const d = new Date(apt.startTime)
    if (period === 'daily') {
      key = d.toISOString().split('T')[0]
    } else if (period === 'weekly') {
      const firstDay = new Date(d.setDate(d.getDate() - d.getDay())).toISOString().split('T')[0]
      key = firstDay
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    }
    
    dataMap.set(key, (dataMap.get(key) || 0) + apt.totalAmount)
  })

  const results = Array.from(dataMap.entries()).map(([date, revenue]) => ({ date, revenue }))
  
  return results
})
