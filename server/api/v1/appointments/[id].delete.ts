import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const id = getRouterParam(event, 'id')

  const existing = await prisma.appointment.findFirst({
    where: { id, tenantId: auth.tenantId }
  })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Appointment not found' })
  }

  await prisma.appointment.delete({
    where: { id }
  })

  return { success: true }
})
