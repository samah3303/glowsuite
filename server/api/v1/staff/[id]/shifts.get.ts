import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const id = getRouterParam(event, 'id')

  const staff = await prisma.staff.findFirst({
    where: { id, tenantId: auth.tenantId }
  })

  if (!staff) {
    throw createError({ statusCode: 404, statusMessage: 'Staff not found' })
  }

  const shifts = await prisma.staffShift.findMany({
    where: { staffId: id },
    orderBy: { dayOfWeek: 'asc' }
  })

  return shifts
})
