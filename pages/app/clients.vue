<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row justify-between gap-4">
      <h1 class="text-2xl font-bold text-surface-50">Clients</h1>
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative w-full sm:w-64">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4" />
          <input type="text" v-model="searchQuery" placeholder="Search clients..." class="input w-full pl-9" />
        </div>
        <button class="btn-primary flex items-center justify-center gap-2 min-h-[44px]">
          <Icon name="lucide:plus" class="w-4 h-4" /> Add Client
        </button>
      </div>
    </div>

    <!-- Desktop Table (Hidden on Mobile) -->
    <div class="hidden md:block glass-card overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-surface-800 bg-surface-900/50 text-surface-400 text-sm">
            <th class="p-4 font-medium">Client Name</th>
            <th class="p-4 font-medium">Contact</th>
            <th class="p-4 font-medium">Last Visit</th>
            <th class="p-4 font-medium text-right">Total Spent</th>
            <th class="p-4 font-medium text-center">Visits</th>
            <th class="p-4 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-800">
          <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-surface-800/30 transition-colors group">
            <td class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-surface-700 flex items-center justify-center text-sm font-bold text-surface-200">
                  {{ client.initials }}
                </div>
                <div>
                  <p class="font-medium text-surface-50">{{ client.name }}</p>
                  <p v-if="client.hasNotes" class="text-xs text-amber-400 flex items-center mt-0.5"><Icon name="lucide:sticky-note" class="w-3 h-3 mr-1"/>Has Notes</p>
                </div>
              </div>
            </td>
            <td class="p-4">
              <p class="text-sm text-surface-200">{{ client.phone }}</p>
              <p class="text-xs text-surface-400">{{ client.email }}</p>
            </td>
            <td class="p-4 text-sm text-surface-300">{{ client.lastVisit }}</td>
            <td class="p-4 text-sm font-semibold text-brand-400 text-right">${{ client.totalSpent }}</td>
            <td class="p-4 text-sm text-surface-300 text-center">{{ client.visits }}</td>
            <td class="p-4 text-center">
              <button class="text-surface-500 hover:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded hover:bg-surface-700">
                <Icon name="lucide:eye" class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards (Hidden on Desktop) -->
    <div class="md:hidden grid grid-cols-1 gap-4">
      <div v-for="client in filteredClients" :key="client.id" class="glass-card-sm p-4 flex flex-col">
        <div class="flex items-center gap-3 mb-3 border-b border-surface-800 pb-3">
          <div class="w-12 h-12 rounded-full bg-surface-700 flex items-center justify-center text-lg font-bold text-surface-200">
            {{ client.initials }}
          </div>
          <div class="flex-1">
            <p class="font-medium text-surface-50 text-lg">{{ client.name }}</p>
            <p class="text-sm text-brand-400 font-semibold">${{ client.totalSpent }} total</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-2 text-sm text-surface-300 mb-4">
          <div>
            <span class="block text-xs text-surface-500">Contact</span>
            {{ client.phone }}
          </div>
          <div>
            <span class="block text-xs text-surface-500">Last Visit</span>
            {{ client.lastVisit }}
          </div>
        </div>
        
        <button class="btn-secondary w-full text-sm min-h-[44px]">View Details</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')

const clients = ref([
  { id: '1', name: 'Sarah Jenkins', initials: 'SJ', phone: '(555) 123-4567', email: 'sarah.j@example.com', lastVisit: 'Aug 2, 2026', totalSpent: 850, visits: 12, hasNotes: true },
  { id: '2', name: 'Mike Ross', initials: 'MR', phone: '(555) 987-6543', email: 'mike.ross@example.com', lastVisit: 'Jul 15, 2026', totalSpent: 320, visits: 8, hasNotes: false },
  { id: '3', name: 'Emily Chen', initials: 'EC', phone: '(555) 456-7890', email: 'echen@example.com', lastVisit: 'Aug 4, 2026', totalSpent: 1200, visits: 15, hasNotes: true },
])

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value
  const lower = searchQuery.value.toLowerCase()
  return clients.value.filter(c => c.name.toLowerCase().includes(lower) || c.phone.includes(lower) || c.email.toLowerCase().includes(lower))
})
</script>
