import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { enforceRateLimit } from '~/server/utils/rateLimit'

const bookingSchema = z.object({
  locationId: z.string(),
  serviceId: z.string(),
  staffId: z.string(),
  startTime: z.string(), // ISO string
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(7),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  // SEC-02: Enforce rate limiting on public booking submissions (max 5 requests per 1 minute per IP)
  enforceRateLimit(event, { maxRequests: 5, windowMs: 60 * 1000, keyPrefix: 'public:booking' })

  const slug = getRouterParam(event, 'slug')
  const body = await readValidatedBody(event, bookingSchema.parse)

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: { id: true, name: true }
  })

  if (!tenant) {
    throw createError({ statusCode: 404, statusMessage: 'Salon not found' })
  }

  const service = await prisma.service.findUnique({
    where: { id: body.serviceId }
  })

  if (!service) {
    throw createError({ statusCode: 404, statusMessage: 'Service not found' })
  }

  const start = new Date(body.startTime)
  const end = new Date(start.getTime() + service.durationMinutes * 60 * 1000)

  // Conflict check for staff member
  const conflict = await prisma.appointment.findFirst({
    where: {
      staffId: body.staffId,
      status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      OR: [
        { startTime: { lte: start }, endTime: { gt: start } },
        { startTime: { lt: end }, endTime: { gte: end } },
        { startTime: { gte: start }, endTime: { lte: end } }
      ]
    }
  })

  if (conflict) {
    throw createError({ statusCode: 409, statusMessage: 'The selected staff member is not available at this time. Please pick another slot.' })
  }

  // Find or create customer
  let customer = await prisma.customer.findFirst({
    where: { tenantId: tenant.id, email: body.customerEmail }
  })

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        tenantId: tenant.id,
        name: body.customerName,
        email: body.customerEmail,
        phone: body.customerPhone,
        notes: body.notes
      }
    })
  }

  // Create appointment
  const appointment = await prisma.appointment.create({
    data: {
      tenantId: tenant.id,
      locationId: body.locationId,
      customerId: customer.id,
      staffId: body.staffId,
      startTime: start,
      endTime: end,
      status: 'CONFIRMED',
      totalAmount: service.price,
      notes: body.notes,
      items: {
        create: {
          serviceId: service.id,
          serviceName: service.name,
          price: service.price,
          duration: service.durationMinutes
        }
      }
    },
    include: {
      staff: true,
      location: true,
      customer: true,
      items: true
    }
  })

  return {
    success: true,
    appointment: {
      id: appointment.id,
      salonName: tenant.name,
      serviceName: service.name,
      staffName: appointment.staff.displayName,
      locationName: appointment.location.name,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      price: appointment.totalAmount,
      customerName: appointment.customer.name
    }
  }
})
