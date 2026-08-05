import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebarOpen: false,
    activeLocationId: null as string | null,
    locations: [] as any[]
  }),
  getters: {
    activeLocation: (state) => state.activeLocationId === 'all' || !state.activeLocationId ? 'All Locations' : state.locations.find(l => l.id === state.activeLocationId)
  },
  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    closeSidebar() {
      this.sidebarOpen = false
    },
    setActiveLocation(id: string | null) {
      this.activeLocationId = id
    },
    async fetchLocations() {
      const { get } = useApi()
      const res: any = await get('/api/v1/locations')
      this.locations = res.data || []
    }
  }
})
