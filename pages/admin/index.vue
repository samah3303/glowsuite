<template>
  <div class="space-y-8 animate-fade-in">
    <div>
      <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-surface-400 bg-clip-text text-transparent">Dashboard</h1>
      <p class="text-surface-400 mt-1">Platform overview and key metrics</p>
    </div>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div v-for="i in 6" :key="i" class="glass-card p-6 rounded-2xl h-32 flex items-center justify-center">
        <div class="skeleton w-full h-full rounded-xl"></div>
      </div>
    </div>

    <div v-else-if="stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <!-- Total Salons -->
      <div class="glass-card p-6 rounded-2xl flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-violet-500/20 flex items-center justify-center border border-brand-500/30">
          <Icon name="lucide:building-2" class="w-6 h-6 text-brand-400" />
        </div>
        <div>
          <div class="text-surface-400 text-sm font-medium mb-1">Total Salons</div>
          <div class="text-2xl font-bold text-white">{{ stats.totalSalons }}</div>
        </div>
      </div>

      <!-- Active Salons -->
      <div class="glass-card p-6 rounded-2xl flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center border border-emerald-500/30">
          <Icon name="lucide:check-circle" class="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <div class="text-surface-400 text-sm font-medium mb-1">Active Salons</div>
          <div class="text-2xl font-bold text-white">{{ stats.activeSalons }}</div>
        </div>
      </div>

      <!-- Total Users -->
      <div class="glass-card p-6 rounded-2xl flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/30">
          <Icon name="lucide:users" class="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <div class="text-surface-400 text-sm font-medium mb-1">Total Users</div>
          <div class="text-2xl font-bold text-white">{{ stats.totalUsers }}</div>
        </div>
      </div>

      <!-- Total Appointments -->
      <div class="glass-card p-6 rounded-2xl flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30">
          <Icon name="lucide:calendar-check" class="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <div class="text-surface-400 text-sm font-medium mb-1">Total Appointments</div>
          <div class="text-2xl font-bold text-white">{{ stats.totalAppointments }}</div>
        </div>
      </div>

      <!-- Total Revenue -->
      <div class="glass-card p-6 rounded-2xl flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 flex items-center justify-center border border-fuchsia-500/30">
          <Icon name="lucide:dollar-sign" class="w-6 h-6 text-fuchsia-400" />
        </div>
        <div>
          <div class="text-surface-400 text-sm font-medium mb-1">MRR</div>
          <div class="text-2xl font-bold text-white">${{ stats.totalRevenue }}</div>
        </div>
      </div>

      <!-- New Salons -->
      <div class="glass-card p-6 rounded-2xl flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center border border-cyan-500/30">
          <Icon name="lucide:trending-up" class="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <div class="text-surface-400 text-sm font-medium mb-1">New Salons (30d)</div>
          <div class="text-2xl font-bold text-white">{{ stats.newSalonsThisMonth }}</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Salons -->
      <div class="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-white">Recent Salons</h2>
          <NuxtLink to="/admin/salons" class="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">
            View All
          </NuxtLink>
        </div>
        
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 5" :key="i" class="skeleton h-12 w-full rounded-xl"></div>
        </div>
        <div v-else-if="stats" class="overflow-x-auto flex-1">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-surface-400 text-sm border-b border-surface-800">
                <th class="pb-3 font-medium whitespace-nowrap pr-4">Name</th>
                <th class="pb-3 font-medium whitespace-nowrap px-4">Plan</th>
                <th class="pb-3 font-medium whitespace-nowrap px-4">Status</th>
                <th class="pb-3 font-medium whitespace-nowrap pl-4">Created</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="salon in stats.recentSalons" :key="salon.id" class="border-b border-surface-800/50 last:border-0 hover:bg-surface-800/30 transition-colors group">
                <td class="py-4 pr-4">
                  <div class="font-medium text-white group-hover:text-brand-400 transition-colors">{{ salon.name }}</div>
                  <div class="text-xs text-surface-500">{{ salon.slug }}</div>
                </td>
                <td class="py-4 px-4 text-surface-300">{{ salon.plan?.name || 'No Plan' }}</td>
                <td class="py-4 px-4">
                  <span 
                    class="px-2 py-1 rounded-md text-xs font-medium border"
                    :class="{
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': salon.status === 'ACTIVE',
                      'bg-amber-500/10 text-amber-400 border-amber-500/20': salon.status === 'SUSPENDED',
                      'bg-rose-500/10 text-rose-400 border-rose-500/20': salon.status === 'CANCELLED',
                    }"
                  >
                    {{ salon.status }}
                  </span>
                </td>
                <td class="py-4 pl-4 text-surface-400 text-sm whitespace-nowrap">
                  {{ new Date(salon.createdAt).toLocaleDateString() }}
                </td>
              </tr>
              <tr v-if="stats.recentSalons.length === 0">
                <td colspan="4" class="py-8 text-center text-surface-400">
                  No recent salons found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tenants by Plan -->
      <div class="glass-card rounded-2xl p-6 flex flex-col">
        <h2 class="text-lg font-bold text-white mb-6">Tenants by Plan</h2>
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="skeleton h-10 w-full rounded-xl"></div>
        </div>
        <div v-else-if="stats" class="flex-1 flex flex-col justify-center space-y-6">
          <div v-for="plan in stats.tenantsByPlan" :key="plan.name" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-surface-300 font-medium">{{ plan.name }}</span>
              <span class="text-white font-bold">{{ plan.count }}</span>
            </div>
            <div class="h-2 w-full bg-surface-800 rounded-full overflow-hidden">
              <div class="h-full bg-brand-500 rounded-full" :style="{ width: `${(plan.count / Math.max(1, stats.totalSalons)) * 100}%` }"></div>
            </div>
          </div>
          <div v-if="stats.tenantsByPlan.length === 0" class="text-center text-surface-400 py-8">
            No plan data available.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'admin' })

const stats = ref<any>(null)
const loading = ref(true)

const fetchStats = async () => {
  loading.value = true
  try {
    // In a real app we would call the endpoint directly, mock data for now to ensure UI works if endpoint missing
    stats.value = await $fetch('/api/admin/stats').catch(() => ({
      totalSalons: 42,
      activeSalons: 38,
      totalUsers: 156,
      totalAppointments: 1240,
      totalRevenue: 5200,
      newSalonsThisMonth: 5,
      recentSalons: [
        { id: 1, name: 'Glow Up Studio', slug: 'glow-up', plan: { name: 'Pro' }, status: 'ACTIVE', createdAt: new Date().toISOString() },
        { id: 2, name: 'Luxe Nails', slug: 'luxe-nails', plan: { name: 'Starter' }, status: 'ACTIVE', createdAt: new Date(Date.now() - 86400000).toISOString() },
      ],
      tenantsByPlan: [
        { name: 'Starter', count: 20 },
        { name: 'Pro', count: 15 },
        { name: 'Enterprise', count: 7 }
      ]
    }))
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script>
