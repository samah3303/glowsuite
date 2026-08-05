import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
  
  if (['/', '/login', '/register'].includes(to.path)) {
    if (auth.isAuthenticated && (to.path === '/login' || to.path === '/register' || to.path === '/')) {
      if (auth.user?.role === 'SUPER_ADMIN') {
        return navigateTo('/admin')
      }
      return navigateTo('/app')
    }
    return
  }

  if (to.path.startsWith('/app') || to.path.startsWith('/admin')) {
    if (!auth.isAuthenticated) {
      await auth.fetchUser()
    }
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
