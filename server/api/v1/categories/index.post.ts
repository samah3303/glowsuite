import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

const postSchema = z.object({
  name: z.string().min(1),
  sortOrder: z.number().optional().default(0)
})

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const body = await readValidatedBody(event, postSchema.parse)

  const category = await prisma.category.create({
    data: {
      tenantId: auth.tenantId,
      name: body.name,
      sortOrder: body.sortOrder
    }
  })

  return category
})
