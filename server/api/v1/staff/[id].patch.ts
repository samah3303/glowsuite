import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

const patchSchema = z.object({
  displayName: z.string().optional(),
  title: z.string().optional(),
  locationId: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
  serviceIds: z.array(z.string()).optional()
})

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readValidatedBody(event, patchSchema.parse)

  const existing = await prisma.staff.findFirst({
    where: { id, tenantId: auth.tenantId }
  })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Staff not found' })
  }

  // Handle service updates if provided
  if (body.serviceIds) {
    await prisma.staffService.deleteMany({
      where: { staffId: id }
    })
    if (body.serviceIds.length > 0) {
      await prisma.staffService.createMany({
        data: body.serviceIds.map(sid => ({ staffId: id, serviceId: sid }))
      })
    }
  }

  const staff = await prisma.staff.update({
    where: { id },
    data: {
      displayName: body.displayName,
      title: body.title,
      locationId: body.locationId,
      color: body.color,
      isActive: body.isActive
    },
    include: { services: { include: { service: true } } }
  })

  return staff
})
