import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

const postSchema = z.object({
  customerId: z.string(),
  staffId: z.string(),
  locationId: z.string(),
  startTime: z.string().datetime(),
  serviceIds: z.array(z.string()),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const body = await readValidatedBody(event, postSchema.parse)
  const startTime = new Date(body.startTime)

  // Get services to calculate end time and total amount
  const services = await prisma.service.findMany({
    where: { id: { in: body.serviceIds }, tenantId: auth.tenantId }
  })

  if (services.length !== body.serviceIds.length) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid services' })
  }

  const totalDuration = services.reduce((acc, s) => acc + s.durationMinutes, 0)
  const totalAmount = services.reduce((acc, s) => acc + s.price, 0)
  
  const endTime = new Date(startTime.getTime() + totalDuration * 60000)

  // Check conflicts
  const conflicts = await prisma.appointment.findFirst({
    where: {
      tenantId: auth.tenantId,
      staffId: body.staffId,
      status: { notIn: ['CANCELLED', 'COMPLETED'] },
      OR: [
        { startTime: { lt: endTime }, endTime: { gt: startTime } }
      ]
    }
  })

  if (conflicts) {
    throw createError({ statusCode: 409, statusMessage: 'Time slot is unavailable' })
  }

  const appointment = await prisma.appointment.create({
    data: {
      tenantId: auth.tenantId,
      locationId: body.locationId,
      customerId: body.customerId,
      staffId: body.staffId,
      startTime,
      endTime,
      totalAmount,
      notes: body.notes,
      items: {
        create: services.map(s => ({
          serviceId: s.id,
          serviceName: s.name,
          price: s.price,
          duration: s.durationMinutes
        }))
      }
    },
    include: { items: true, customer: true, staff: true }
  })

  return appointment
})
