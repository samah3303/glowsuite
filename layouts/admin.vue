<template>
  <div class="min-h-screen bg-surface-950 text-surface-50 flex font-sans selection:bg-brand-500/30">
    <!-- Mobile Sidebar Backdrop -->
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-surface-900/50 backdrop-blur-xl border-r border-surface-800/50 flex flex-col transition-transform duration-300 ease-in-out',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- Logo -->
      <div class="p-6 flex flex-col items-start border-b border-surface-800/50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-violet-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Icon name="lucide:sparkles" class="w-6 h-6 text-white" />
          </div>
          <div>
            <span class="text-xl font-bold bg-gradient-to-r from-white to-surface-300 bg-clip-text text-transparent">GlowSuite</span>
            <div class="text-[10px] font-bold text-brand-400 tracking-widest mt-0.5">SUPER ADMIN</div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex-1 overflow-y-auto p-4 py-6 flex flex-col gap-2">
        <NuxtLink 
          v-for="link in links" 
          :key="link.path"
          :to="link.path"
          @click="isSidebarOpen = false"
          class="flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-surface-400 hover:text-white hover:bg-surface-800/50 transition-all duration-200 group"
          active-class="!text-white bg-surface-800/80 shadow-sm border border-surface-700/50"
        >
          <Icon :name="link.icon" class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" :class="{ 'text-brand-400': $route.path === link.path }" />
          <span class="font-medium">{{ link.name }}</span>
        </NuxtLink>
        
        <div class="mt-auto pt-6 border-t border-surface-800/50" v-if="auth.user?.tenantId">
          <NuxtLink 
            to="/app"
            @click="isSidebarOpen = false"
            class="flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-surface-400 hover:text-white hover:bg-surface-800/50 transition-all duration-200 group"
          >
            <Icon name="lucide:arrow-left" class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span class="font-medium">Back to Salon</span>
          </NuxtLink>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 min-h-screen">
      <!-- Topbar -->
      <header class="h-16 md:h-20 bg-surface-900/50 backdrop-blur-xl border-b border-surface-800/50 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button 
            @click="isSidebarOpen = true"
            class="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 rounded-xl transition-colors"
          >
            <Icon name="lucide:menu" class="w-6 h-6" />
          </button>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="hidden sm:flex flex-col items-end">
              <span class="text-sm font-medium text-white">{{ auth.user?.firstName }} {{ auth.user?.lastName }}</span>
              <span class="text-xs text-brand-400">Super Admin</span>
            </div>
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-surface-700 to-surface-800 flex items-center justify-center border border-surface-700">
              <Icon name="lucide:user" class="w-5 h-5 text-surface-400" />
            </div>
            <button 
              @click="handleLogout"
              class="min-w-[44px] min-h-[44px] flex items-center justify-center text-surface-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors ml-2"
              title="Sign Out"
            >
              <Icon name="lucide:log-out" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 p-4 md:p-8 overflow-x-hidden">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const isSidebarOpen = ref(false)

const links = [
  { name: 'Dashboard', path: '/admin', icon: 'lucide:layout-dashboard' },
  { name: 'Salons', path: '/admin/salons', icon: 'lucide:building-2' },
  { name: 'Plans', path: '/admin/plans', icon: 'lucide:credit-card' },
]

const handleLogout = async () => {
  await auth.logout()
  navigateTo('/login')
}
</script>
