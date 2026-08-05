import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().optional(),
  status: z.string().optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  const id = getRouterParam(event, 'id')
  const body = await readValidatedBody(event, updateSchema.parse)
  
  const tenant = await prisma.tenant.update({
    where: { id },
    data: body
  })
  
  return tenant
})
