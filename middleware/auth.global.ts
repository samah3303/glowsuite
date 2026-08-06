import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
  
  // Attempt to load user from session cookie if not loaded yet
  if (!auth.isAuthenticated) {
    await auth.fetchUser()
  }

  if (['/', '/login', '/register'].includes(to.path)) {
    if (auth.isAuthenticated) {
      if (auth.user?.role === 'SUPER_ADMIN') {
        return navigateTo('/admin')
      }
      return navigateTo('/app')
    }
    return
  }

  if (to.path.startsWith('/app') || to.path.startsWith('/admin')) {
    if (!auth.isAuthenticated) {
      return navigateTo('/login')
    }
    
    if (to.path.startsWith('/app') && auth.user?.role === 'SUPER_ADMIN') {
      return navigateTo('/admin')
    }
    
    if (to.path.startsWith('/admin') && auth.user?.role !== 'SUPER_ADMIN') {
      return navigateTo('/app')
    }
  }
})
