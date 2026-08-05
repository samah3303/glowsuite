import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

const patchSchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().optional(),
  durationMinutes: z.number().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  bufferMinutes: z.number().optional(),
  isActive: z.boolean().optional(),
  staffIds: z.array(z.string()).optional()
})

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readValidatedBody(event, patchSchema.parse)

  const existing = await prisma.service.findFirst({
    where: { id, tenantId: auth.tenantId }
  })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Service not found' })
  }

  if (body.staffIds) {
    await prisma.staffService.deleteMany({
      where: { serviceId: id }
    })
    if (body.staffIds.length > 0) {
      await prisma.staffService.createMany({
        data: body.staffIds.map(sid => ({ staffId: sid, serviceId: id }))
      })
    }
  }

  const service = await prisma.service.update({
    where: { id },
    data: {
      name: body.name,
      categoryId: body.categoryId,
      durationMinutes: body.durationMinutes,
      price: body.price,
      description: body.description,
      bufferMinutes: body.bufferMinutes,
      isActive: body.isActive
    },
    include: { staff: true }
  })

  return service
})
