<template>
  <div class="min-h-screen bg-surface-950 text-surface-50 font-sans selection:bg-brand-500/30">
    <!-- Sidebar Overlay (Mobile) -->
    <div v-if="app.sidebarOpen" 
         class="fixed inset-0 bg-surface-950/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"
         @click="app.closeSidebar()">
    </div>

    <!-- Sidebar -->
    <aside class="fixed top-0 left-0 bottom-0 w-[260px] bg-surface-900/50 backdrop-blur-md border-r border-surface-800 z-50 transition-transform duration-300 flex flex-col"
           :class="{'translate-x-0': app.sidebarOpen, '-translate-x-full': !app.sidebarOpen, 'md:translate-x-0': true}">
      
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-surface-800/50">
        <Icon name="lucide:scissors" class="w-6 h-6 text-brand-400 mr-2" />
        <span class="text-xl font-bold bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">GlowSuite</span>
        <button aria-label="Close sidebar" class="ml-auto md:hidden text-surface-400 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2" @click="app.closeSidebar()">
          <Icon name="lucide:x" class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        <NuxtLink v-for="link in navLinks" :key="link.path" :to="link.path"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px]"
                  :class="route.path === link.path || route.path.startsWith(link.path + '/') && link.path !== '/app' ? 'bg-brand-500/10 text-brand-300' : 'text-surface-300 hover:text-surface-100 hover:bg-surface-800/50'"
                  @click="app.closeSidebar()">
          <Icon :name="link.icon" class="w-5 h-5" :class="route.path === link.path || route.path.startsWith(link.path + '/') && link.path !== '/app' ? 'text-brand-400' : 'text-surface-400'" />
          {{ link.name }}
        </NuxtLink>
      </nav>

      <!-- Bottom User Info -->
      <div class="p-4 border-t border-surface-800/50">
        <div class="flex items-center gap-3 px-2 py-2">
          <div class="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold">
            {{ initials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ auth.fullName }}</p>
            <p class="text-xs text-surface-400 truncate">{{ auth.tenant?.name }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Topbar -->
    <header class="fixed top-0 right-0 left-0 md:left-[260px] h-16 glass-card-sm !rounded-none !border-l-0 !border-t-0 !border-r-0 z-30 flex items-center justify-between px-4">
      <div class="flex items-center gap-2">
        <button aria-label="Open sidebar menu" class="md:hidden text-surface-300 min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2" @click="app.toggleSidebar()">
          <Icon name="lucide:menu" class="w-6 h-6" />
        </button>
        
        <!-- Location Switcher -->
        <div class="relative group">
          <button aria-label="Select location" class="flex items-center gap-2 text-sm font-medium text-surface-200 hover:text-white min-h-[44px]">
            <Icon name="lucide:map-pin" class="w-4 h-4 text-brand-400" />
            {{ app.activeLocation?.name || 'All Locations' }}
            <Icon name="lucide:chevron-down" class="w-4 h-4 text-surface-500" />
          </button>
          <div class="absolute left-0 top-full mt-1 w-48 glass-card border border-surface-700 py-1 hidden group-hover:block z-50">
            <button @click="app.setActiveLocation('all')" class="w-full text-left px-4 py-2 text-sm hover:bg-surface-800 text-surface-200 min-h-[44px]">
              All Locations
            </button>
            <button v-for="loc in app.locations" :key="loc.id" @click="app.setActiveLocation(loc.id)" class="w-full text-left px-4 py-2 text-sm hover:bg-surface-800 text-surface-200 min-h-[44px]">
              {{ loc.name }}
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button aria-label="View notifications" class="text-surface-400 hover:text-surface-100 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-surface-800/50 transition-colors">
          <Icon name="lucide:bell" class="w-5 h-5" />
        </button>
        
        <div class="relative group ml-2">
           <button aria-label="User account menu" class="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold border-2 border-surface-800 hover:border-brand-500 transition-colors">
            {{ initials }}
          </button>
          <div class="absolute right-0 top-full mt-2 w-48 glass-card border border-surface-700 py-1 hidden group-hover:block z-50">
            <button @click="navigateTo('/app/settings')" class="w-full text-left px-4 py-2 text-sm hover:bg-surface-800 text-surface-200 min-h-[44px] flex items-center gap-2">
              <Icon name="lucide:user" class="w-4 h-4" /> Profile
            </button>
            <button @click="auth.logout()" class="w-full text-left px-4 py-2 text-sm hover:bg-surface-800 text-red-400 min-h-[44px] flex items-center gap-2">
              <Icon name="lucide:log-out" class="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-16 md:ml-[260px] min-h-screen p-4 md:p-6 transition-all duration-300">
      <slot />
    </main>

    <!-- Global Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useAppStore } from '~/stores/app'

const route = useRoute()
const auth = useAuthStore()
const app = useAppStore()

const initials = computed(() => {
  if (!auth.user) return '?'
  return `${auth.user.firstName?.[0] || ''}${auth.user.lastName?.[0] || ''}`.toUpperCase()
})

const navLinks = [
  { name: 'Dashboard', path: '/app', icon: 'lucide:layout-dashboard' },
  { name: 'Calendar', path: '/app/calendar', icon: 'lucide:calendar' },
  { name: 'Services', path: '/app/services', icon: 'lucide:scissors' },
  { name: 'Staff', path: '/app/staff', icon: 'lucide:users' },
  { name: 'Clients', path: '/app/clients', icon: 'lucide:user-circle' },
  { name: 'Analytics', path: '/app/analytics', icon: 'lucide:bar-chart-3' },
  { name: 'Settings', path: '/app/settings', icon: 'lucide:settings' },
]

onMounted(() => {
  app.fetchLocations()
})
</script>
