import { z } from 'zod'

const planSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  price: z.number().default(0),
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
  
  const body = await readValidatedBody(event, planSchema.parse)
  
  const plan = await prisma.plan.create({ data: body })
  return plan
})
