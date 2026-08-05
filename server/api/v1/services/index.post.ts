import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

const postSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string(),
  durationMinutes: z.number().min(1),
  price: z.number().min(0),
  description: z.string().optional(),
  bufferMinutes: z.number().optional().default(0),
  staffIds: z.array(z.string()).optional()
})

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const body = await readValidatedBody(event, postSchema.parse)

  // Verify category exists
  const category = await prisma.category.findFirst({
    where: { id: body.categoryId, tenantId: auth.tenantId }
  })

  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  const service = await prisma.service.create({
    data: {
      tenantId: auth.tenantId,
      categoryId: body.categoryId,
      name: body.name,
      description: body.description,
      durationMinutes: body.durationMinutes,
      bufferMinutes: body.bufferMinutes,
      price: body.price,
      staff: body.staffIds?.length ? {
        create: body.staffIds.map(id => ({ staffId: id }))
      } : undefined
    },
    include: { staff: true }
  })

  return service
})
