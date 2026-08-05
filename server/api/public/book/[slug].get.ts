import { prisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      currency: true,
      timezone: true,
      locations: {
        where: { isActive: true },
        select: { id: true, name: true, address: true, city: true, phone: true }
      },
      categories: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          name: true,
          services: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              description: true,
              durationMinutes: true,
              price: true
            }
          }
        }
      },
      staff: {
        where: { isActive: true },
        select: {
          id: true,
          displayName: true,
          title: true,
          color: true,
          locationId: true,
          services: {
            select: { serviceId: true }
          }
        }
      }
    }
  })

  if (!tenant) {
    throw createError({ statusCode: 404, statusMessage: 'Salon not found' })
  }

  return tenant
})
