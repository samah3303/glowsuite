import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

const patchSchema = z.object({
  status: z.string().optional(),
  notes: z.string().optional(),
  staffId: z.string().optional(),
  startTime: z.string().datetime().optional()
})

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readValidatedBody(event, patchSchema.parse)

  // Verify existence and tenant
  const existing = await prisma.appointment.findFirst({
    where: { id, tenantId: auth.tenantId },
    include: { items: true }
  })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Appointment not found' })
  }

  let endTime = existing.endTime
  let startTime = existing.startTime

  if (body.startTime) {
    startTime = new Date(body.startTime)
    const durationMs = existing.endTime.getTime() - existing.startTime.getTime()
    endTime = new Date(startTime.getTime() + durationMs)
    
    // Simple conflict check if time or staff changed
    const staffIdToCheck = body.staffId || existing.staffId
    const conflict = await prisma.appointment.findFirst({
      where: {
        id: { not: id },
        tenantId: auth.tenantId,
        staffId: staffIdToCheck,
        status: { notIn: ['CANCELLED', 'COMPLETED'] },
        OR: [
          { startTime: { lt: endTime }, endTime: { gt: startTime } }
        ]
      }
    })
    
    if (conflict) {
      throw createError({ statusCode: 409, statusMessage: 'Time slot is unavailable' })
    }
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      status: body.status,
      notes: body.notes,
      staffId: body.staffId,
      startTime,
      endTime
    },
    include: { customer: true, staff: true, items: true }
  })

  return updated
})
