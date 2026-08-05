import { z } from 'zod'
import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'

const postSchema = z.object({
  displayName: z.string().min(1),
  title: z.string().optional(),
  locationId: z.string(),
  color: z.string().optional(),
  serviceIds: z.array(z.string()).optional()
})

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const body = await readValidatedBody(event, postSchema.parse)

  const staff = await prisma.staff.create({
    data: {
      tenantId: auth.tenantId,
      locationId: body.locationId,
      displayName: body.displayName,
      title: body.title,
      color: body.color || '#8B5CF6',
      services: body.serviceIds?.length ? {
        create: body.serviceIds.map(id => ({ serviceId: id }))
      } : undefined
    },
    include: { services: true }
  })

  return staff
})
