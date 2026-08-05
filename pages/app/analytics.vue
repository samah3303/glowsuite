<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row justify-between gap-4">
      <h1 class="text-2xl font-bold text-surface-50">Analytics</h1>
      <select class="input bg-surface-900 w-full sm:w-auto">
        <option>This Week</option>
        <option>This Month</option>
        <option>Last 3 Months</option>
        <option>This Year</option>
      </select>
    </div>

    <!-- Revenue Chart -->
    <div class="glass-card p-5">
      <div class="mb-4">
        <h2 class="text-lg font-semibold text-surface-50">Revenue Trend</h2>
        <p class="text-sm text-surface-400">Total revenue over selected period</p>
      </div>
      
      <!-- Simple CSS Bar Chart fallback since SVG might be complex -->
      <div class="h-64 flex items-end gap-2 md:gap-4 mt-8 pb-6 border-b border-surface-800 relative">
        <div v-for="(day, i) in revenueData" :key="i" class="flex-1 flex flex-col items-center justify-end h-full group relative">
          <!-- Tooltip -->
          <div class="absolute -top-10 bg-surface-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
            ${{ day.amount }}
          </div>
          <!-- Bar -->
          <div class="w-full max-w-[40px] bg-brand-500/80 rounded-t-sm group-hover:bg-brand-400 transition-colors"
               :style="{ height: `${(day.amount / maxRevenue) * 100}%` }"></div>
          <!-- Label -->
          <span class="absolute -bottom-6 text-xs text-surface-400">{{ day.label }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Appointments by Status -->
      <div class="glass-card p-5">
        <h2 class="text-lg font-semibold text-surface-50 mb-4">Appointments Overview</h2>
        <div class="space-y-4">
          <div v-for="stat in statusData" :key="stat.status" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-surface-300 capitalize">{{ stat.status }}</span>
              <span class="font-medium text-surface-50">{{ stat.count }}</span>
            </div>
            <div class="h-2 bg-surface-800 rounded-full overflow-hidden">
              <div class="h-full rounded-full" 
                   :class="stat.colorClass"
                   :style="{ width: `${(stat.count / totalAppointments) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Services -->
      <div class="glass-card p-5">
        <h2 class="text-lg font-semibold text-surface-50 mb-4">Top Services by Revenue</h2>
        <div class="space-y-4">
          <div v-for="service in topServices" :key="service.name" class="flex items-center gap-4">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-surface-50 truncate">{{ service.name }}</p>
              <div class="h-1.5 bg-surface-800 rounded-full mt-1.5 overflow-hidden">
                <div class="h-full bg-brand-500 rounded-full" :style="{ width: `${(service.revenue / maxServiceRevenue) * 100}%` }"></div>
              </div>
            </div>
            <div class="shrink-0 text-right">
              <p class="text-sm font-bold text-brand-400">${{ service.revenue }}</p>
              <p class="text-xs text-surface-400">{{ service.count }} booked</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const revenueData = ref([
  { label: 'Mon', amount: 850 },
  { label: 'Tue', amount: 1200 },
  { label: 'Wed', amount: 950 },
  { label: 'Thu', amount: 1500 },
  { label: 'Fri', amount: 2100 },
  { label: 'Sat', amount: 2400 },
  { label: 'Sun', amount: 600 },
])
const maxRevenue = computed(() => Math.max(...revenueData.value.map(d => d.amount)))

const statusData = ref([
  { status: 'Completed', count: 145, colorClass: 'bg-emerald-500' },
  { status: 'Upcoming', count: 42, colorClass: 'bg-blue-500' },
  { status: 'Cancelled', count: 12, colorClass: 'bg-red-500' },
  { status: 'No Show', count: 3, colorClass: 'bg-surface-500' },
])
const totalAppointments = computed(() => statusData.value.reduce((acc, curr) => acc + curr.count, 0))

const topServices = ref([
  { name: 'Women\'s Haircut', revenue: 4500, count: 75 },
  { name: 'Full Balayage', revenue: 3600, count: 20 },
  { name: 'Color Retouch', revenue: 2250, count: 30 },
  { name: 'Men\'s Fade', revenue: 1600, count: 40 },
])
const maxServiceRevenue = computed(() => Math.max(...topServices.value.map(s => s.revenue)))
</script>
