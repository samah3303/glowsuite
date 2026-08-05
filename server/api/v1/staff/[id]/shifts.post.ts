import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

const shiftSchema = z.object({
  shifts: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
    isWorking: z.boolean()
  }))
})

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readValidatedBody(event, shiftSchema.parse)

  const staff = await prisma.staff.findFirst({
    where: { id, tenantId: auth.tenantId }
  })

  if (!staff) {
    throw createError({ statusCode: 404, statusMessage: 'Staff not found' })
  }

  // Delete existing shifts and recreate
  await prisma.staffShift.deleteMany({
    where: { staffId: id }
  })

  const shifts = await Promise.all(body.shifts.map(shift => 
    prisma.staffShift.create({
      data: {
        staffId: id,
        dayOfWeek: shift.dayOfWeek,
        startTime: shift.startTime,
        endTime: shift.endTime,
        isWorking: shift.isWorking
      }
    })
  ))

  return shifts
})
