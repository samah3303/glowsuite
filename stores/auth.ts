import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { id: string, email: string, firstName: string, lastName: string, role: string },
    tenant: null as null | { id: string, name: string, slug: string },
    isLoading: false
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    fullName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
    userRole: (state) => state.user?.role || ''
  },
  actions: {
    async login(email: string, password: string) {
      this.isLoading = true
      try {
        const { post } = useApi()
        const res: any = await post('/api/auth/login', { email, password })
        this.user = res.user
        this.tenant = res.tenant
      } finally {
        this.isLoading = false
      }
    },
    async register(salonName: string, email: string, password: string, firstName: string, lastName: string) {
      this.isLoading = true
      try {
        const { post } = useApi()
        const res: any = await post('/api/auth/register', { salonName, email, password, firstName, lastName })
        this.user = res.user
        this.tenant = res.tenant
      } finally {
        this.isLoading = false
      }
    },
    async logout() {
      const { post } = useApi()
      await post('/api/auth/logout', {})
      this.user = null
      this.tenant = null
      navigateTo('/login')
    },
    async fetchUser() {
      try {
        const { get } = useApi()
        const res: any = await get('/api/auth/me')
        this.user = res.user
        this.tenant = res.tenant
      } catch (e) {
        this.user = null
        this.tenant = null
      }
    }
  }
})
