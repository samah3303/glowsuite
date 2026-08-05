import { getAuthCookieOptions } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // Clear glowsuite_token cookie securely
  setCookie(event, 'glowsuite_token', '', {
    ...getAuthCookieOptions(),
    maxAge: 0
  })

  return { success: true }
})
