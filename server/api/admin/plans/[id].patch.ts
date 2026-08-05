import { z } from 'zod'

const planUpdateSchema = z.object({
  name: z.string().optional(),
  displayName: z.string().optional(),
  price: z.number().optional(),
  interval: z.string().optional(),
  maxLocations: z.number().optional(),
  maxStaff: z.number().optional(),
  maxServices: z.number().optional(),
  features: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional()
})

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  const id = getRouterParam(event, 'id')
  const body = await readValidatedBody(event, planUpdateSchema.parse)
  
  const plan = await prisma.plan.update({
    where: { id },
    data: body
  })
  return plan
})
