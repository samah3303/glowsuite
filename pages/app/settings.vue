<template>
  <div class="space-y-6 animate-fade-in max-w-4xl">
    <h1 class="text-2xl font-bold text-surface-50">Settings</h1>

    <!-- Tabs -->
    <div class="flex border-b border-surface-800 overflow-x-auto hide-scrollbar">
      <button v-for="tab in tabs" :key="tab.id"
              @click="activeTab = tab.id"
              class="px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap min-h-[44px]"
              :class="activeTab === tab.id ? 'border-brand-500 text-brand-400' : 'border-transparent text-surface-400 hover:text-surface-200'">
        {{ tab.label }}
      </button>
    </div>

    <div class="mt-6">
      <!-- Business Profile -->
      <div v-if="activeTab === 'business'" class="glass-card p-6 space-y-6">
        <div>
          <h2 class="text-lg font-semibold text-surface-50">Business Profile</h2>
          <p class="text-sm text-surface-400">Manage your salon's general information.</p>
        </div>
        
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-1">
            <label class="input-label">Salon Name</label>
            <input type="text" :value="auth.tenant?.name" class="input w-full bg-surface-900/50" readonly />
          </div>
          <div class="space-y-1">
            <label class="input-label">Subdomain</label>
            <input type="text" :value="`${auth.tenant?.slug}.glowsuite.app`" class="input w-full bg-surface-900/50" readonly />
          </div>
        </div>
      </div>

      <!-- Locations -->
      <div v-if="activeTab === 'locations'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-surface-50">Locations</h2>
          <button class="btn-primary btn-sm flex items-center gap-1 min-h-[36px]">
            <Icon name="lucide:plus" class="w-4 h-4" /> Add
          </button>
        </div>
        
        <div class="grid gap-4">
          <div v-for="loc in app.locations" :key="loc.id" class="glass-card-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="font-semibold text-surface-50">{{ loc.name }}</h3>
              <p class="text-sm text-surface-400">{{ loc.address }}, {{ loc.city }}</p>
            </div>
            <button class="btn-secondary min-h-[36px] w-full sm:w-auto">Edit</button>
          </div>
          <div v-if="!app.locations.length" class="text-center p-8 text-surface-400 glass-card-sm">
            No locations found.
          </div>
        </div>
      </div>

      <!-- Account -->
      <div v-if="activeTab === 'account'" class="glass-card p-6 space-y-6">
        <div>
          <h2 class="text-lg font-semibold text-surface-50">Personal Account</h2>
          <p class="text-sm text-surface-400">Manage your user profile and security.</p>
        </div>
        
        <div class="flex items-center gap-4 border-b border-surface-800 pb-6">
          <div class="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
            {{ auth.user?.firstName?.[0] }}{{ auth.user?.lastName?.[0] }}
          </div>
          <div>
            <p class="font-medium text-surface-50 text-lg">{{ auth.fullName }}</p>
            <p class="text-sm text-surface-400">{{ auth.user?.email }}</p>
            <span class="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-surface-800 text-surface-300 capitalize">{{ auth.userRole }}</span>
          </div>
        </div>

        <div class="pt-2">
          <button @click="auth.logout()" class="btn-danger flex items-center justify-center gap-2 min-h-[44px] px-6">
            <Icon name="lucide:log-out" class="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAppStore } from '~/stores/app'

const auth = useAuthStore()
const app = useAppStore()

const activeTab = ref('business')
const tabs = [
  { id: 'business', label: 'Business Profile' },
  { id: 'locations', label: 'Locations' },
  { id: 'account', label: 'Account' }
]
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
