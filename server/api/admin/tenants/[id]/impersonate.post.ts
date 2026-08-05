import { prisma } from '~/server/utils/db'
import { requireAuth, generateToken, getAuthCookieOptions } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  const id = getRouterParam(event, 'id')
  
  const owner = await prisma.user.findFirst({
    where: { tenantId: id, role: 'OWNER' }
  })
  
  if (!owner) throw createError({ statusCode: 404, statusMessage: 'Owner not found for tenant' })
  
  const tenant = await prisma.tenant.findUnique({ where: { id } })
  
  const token = generateToken({ userId: owner.id, tenantId: id!, role: owner.role })
  
  // SEC-03: Set cookie using secure cookie options helper
  setCookie(event, 'glowsuite_token', token, getAuthCookieOptions())
  
  return { success: true, user: owner, tenant }
})
