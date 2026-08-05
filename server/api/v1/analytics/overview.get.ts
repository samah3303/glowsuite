import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const query = getQuery(event)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)

  const baseWhere: any = { tenantId: auth.tenantId }
  if (query.locationId) {
    baseWhere.locationId = String(query.locationId)
  }

  // Today Revenue & Appointments
  const todayAppointments = await prisma.appointment.findMany({
    where: {
      ...baseWhere,
      startTime: { gte: today, lt: tomorrow },
      status: { notIn: ['CANCELLED'] }
    }
  })

  const todayRevenue = todayAppointments.reduce((acc, apt) => acc + apt.totalAmount, 0)

  // New Clients this week
  const weekNewClients = await prisma.customer.count({
    where: {
      tenantId: auth.tenantId,
      createdAt: { gte: lastWeek }
    }
  })

  // Simple occupancy rate calculation for today
  // Assuming 8 hours * 60 mins = 480 mins available per staff
  const activeStaffCount = await prisma.staff.count({
    where: { tenantId: auth.tenantId, isActive: true, ...(query.locationId ? { locationId: String(query.locationId) } : {}) }
  })
  
  let occupancyRate = 0
  if (activeStaffCount > 0) {
    const totalMinutesBooked = todayAppointments.reduce((acc, apt) => {
      return acc + (apt.endTime.getTime() - apt.startTime.getTime()) / 60000
    }, 0)
    const totalCapacityMinutes = activeStaffCount * 480
    occupancyRate = Math.round((totalMinutesBooked / totalCapacityMinutes) * 100)
  }

  return {
    todayRevenue,
    todayAppointments: todayAppointments.length,
    weekNewClients,
    occupancyRate
  }
})
