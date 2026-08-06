<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-50">Dashboard</h1>
        <p class="text-surface-400">Good {{ greeting }}, {{ auth.user?.firstName }}!</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-2">
        <NuxtLink to="/app/calendar" class="btn-primary flex items-center justify-center gap-2 min-h-[44px]">
          <Icon name="lucide:plus" class="w-4 h-4" /> New Appointment
        </NuxtLink>
        <div class="flex gap-2">
          <NuxtLink to="/app/clients" class="btn-secondary flex-1 flex items-center justify-center gap-2 min-h-[44px]">
            <Icon name="lucide:user-plus" class="w-4 h-4" /> Client
          </NuxtLink>
          <NuxtLink to="/app/services" class="btn-secondary flex-1 flex items-center justify-center gap-2 min-h-[44px]">
            <Icon name="lucide:scissors" class="w-4 h-4" /> Service
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Revenue -->
      <div class="glass-card p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
          <Icon name="lucide:dollar-sign" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-surface-400 text-sm font-medium">Today's Revenue</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-2xl font-bold text-surface-50">{{ isLoading ? '...' : `$${overview?.todayRevenue || 0}` }}</h3>
            <span class="text-xs text-emerald-400 flex items-center"><Icon name="lucide:trending-up" class="w-3 h-3 mr-1"/>Live</span>
          </div>
        </div>
      </div>

      <!-- Appointments -->
      <div class="glass-card p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Icon name="lucide:calendar-check" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-surface-400 text-sm font-medium">Appointments</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-2xl font-bold text-surface-50">{{ isLoading ? '...' : overview?.todayAppointments || 0 }}</h3>
          </div>
        </div>
      </div>

      <!-- New Clients -->
      <div class="glass-card p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <Icon name="lucide:user-plus" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-surface-400 text-sm font-medium">New Clients</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-2xl font-bold text-surface-50">{{ isLoading ? '...' : overview?.weekNewClients || 0 }}</h3>
          </div>
        </div>
      </div>

      <!-- Occupancy -->
      <div class="glass-card p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
          <Icon name="lucide:activity" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-surface-400 text-sm font-medium">Occupancy Rate</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-2xl font-bold text-surface-50">{{ isLoading ? '...' : `${overview?.occupancyRate || 0}%` }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Appointments -->
    <div class="glass-card overflow-hidden">
      <div class="p-5 border-b border-surface-800 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-surface-50">Upcoming Appointments</h2>
        <NuxtLink to="/app/calendar" class="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center min-h-[44px]">
          View Calendar <Icon name="lucide:arrow-right" class="w-4 h-4 ml-1" />
        </NuxtLink>
      </div>
      
      <div v-if="isLoading" class="p-8 flex justify-center">
        <Icon name="lucide:loader-2" class="w-8 h-8 text-brand-500 animate-spin" />
      </div>
      <div v-else-if="!appointments.length" class="p-8 text-center text-surface-400">
        No upcoming appointments scheduled.
      </div>
      <div v-else class="divide-y divide-surface-800/50">
        <div v-for="apt in appointments" :key="apt.id" class="p-4 hover:bg-surface-800/30 transition-colors flex flex-col md:flex-row md:items-center gap-4">
          <div class="w-24 text-surface-300 font-medium shrink-0">{{ formatTime(apt.startTime) }}</div>
          
          <div class="flex-1 min-w-0">
            <p class="text-surface-50 font-medium truncate">{{ apt.clientName }}</p>
            <p class="text-surface-400 text-sm truncate">{{ apt.serviceName }}</p>
          </div>
          
          <div class="flex items-center gap-2 shrink-0">
            <div class="w-6 h-6 rounded-full bg-surface-700 flex items-center justify-center text-xs font-bold text-surface-300">
              {{ apt.staffName.charAt(0) }}
            </div>
            <span class="text-sm text-surface-300 w-24 truncate">{{ apt.staffName }}</span>
          </div>

          <div class="shrink-0 w-28 text-right">
            <span class="px-2 py-1 rounded-full text-xs font-medium border uppercase tracking-wider"
                  :class="{
                    'bg-surface-800 text-surface-200 border-surface-700': apt.status === 'scheduled',
                    'bg-blue-500/10 text-blue-400 border-blue-500/20': apt.status === 'confirmed',
                    'bg-amber-500/10 text-amber-400 border-amber-500/20': apt.status === 'in-service',
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': apt.status === 'completed'
                  }">
              {{ apt.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'
import { useAppStore } from '~/stores/app'

const auth = useAuthStore()
const app = useAppStore()
const { get } = useApi()

const isLoading = ref(true)
const overview = ref<any>(null)
const appointments = ref<any[]>([])

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
})

const formatTime = (isoString: string) => {
  if (!isoString) return ''
  return new Date(isoString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const locationId = app.activeLocationId || 'all'
    const [statsRes, aptsRes] = await Promise.all([
      get(`/api/v1/analytics/overview`, { locationId }).catch(() => ({ todayRevenue: 0, todayAppointments: 0, weekNewClients: 0, occupancyRate: 0 })),
      get(`/api/v1/appointments`, { locationId }).catch(() => ([]))
    ])

    overview.value = statsRes
    const rawApts = Array.isArray(aptsRes) ? aptsRes : (aptsRes as any)?.data || []
    appointments.value = rawApts.map((a: any) => ({
      id: a.id,
      startTime: a.startTime,
      clientName: a.customer?.name || a.clientName || 'Guest Client',
      serviceName: a.items?.[0]?.serviceName || a.serviceName || 'General Service',
      staffName: a.staff?.displayName || a.staffName || 'Staff Member',
      status: (a.status || 'SCHEDULED').toLowerCase()
    }))
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
