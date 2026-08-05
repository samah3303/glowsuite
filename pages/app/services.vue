<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h1 class="text-2xl font-bold text-surface-50">Services & Pricing</h1>
      <div class="flex gap-2">
        <button class="btn-secondary flex-1 sm:flex-none flex items-center justify-center gap-2 min-h-[44px]">
          <Icon name="lucide:folder-plus" class="w-4 h-4" /> Add Category
        </button>
        <button class="btn-primary flex-1 sm:flex-none flex items-center justify-center gap-2 min-h-[44px]">
          <Icon name="lucide:plus" class="w-4 h-4" /> Add Service
        </button>
      </div>
    </div>

    <div class="space-y-8">
      <div v-for="category in categories" :key="category.id" class="space-y-4">
        <!-- Category Header -->
        <div class="flex items-center gap-2 border-b border-surface-800 pb-2">
          <h2 class="text-lg font-semibold text-surface-100">{{ category.name }}</h2>
          <span class="px-2 py-0.5 rounded-full bg-surface-800 text-xs font-medium text-surface-400">{{ category.services.length }}</span>
        </div>

        <!-- Services Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="service in category.services" :key="service.id" class="glass-card-sm p-5 hover:bg-surface-800/40 transition-colors group">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-surface-50 pr-4">{{ service.name }}</h3>
              <div class="text-lg font-bold text-brand-400 shrink-0">${{ service.price }}</div>
            </div>
            
            <p class="text-sm text-surface-400 line-clamp-2 mb-4 h-10">{{ service.description }}</p>
            
            <div class="flex items-center justify-between border-t border-surface-800/50 pt-4 mt-auto">
              <div class="flex items-center gap-3">
                <span class="flex items-center text-xs font-medium text-surface-300 bg-surface-800 px-2 py-1 rounded-md">
                  <Icon name="lucide:clock" class="w-3 h-3 mr-1.5" /> {{ service.duration }} min
                </span>
                <span class="flex items-center text-xs text-surface-400">
                  <Icon name="lucide:users" class="w-3 h-3 mr-1" /> {{ service.staffCount }} staff
                </span>
              </div>
              <button class="text-surface-500 hover:text-brand-400 transition-colors opacity-100 lg:opacity-0 group-hover:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2">
                <Icon name="lucide:edit-2" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Mock Data
const categories = ref([
  {
    id: '1',
    name: 'Haircuts & Styling',
    services: [
      { id: '1', name: 'Women\'s Haircut', price: 65, duration: 60, description: 'Includes wash, cut, and signature blowout style.', staffCount: 4 },
      { id: '2', name: 'Men\'s Classic Cut', price: 40, duration: 30, description: 'Classic clipper or scissor cut with wash.', staffCount: 3 },
      { id: '3', name: 'Blowout', price: 45, duration: 45, description: 'Wash and professional styling.', staffCount: 5 }
    ]
  },
  {
    id: '2',
    name: 'Color Services',
    services: [
      { id: '4', name: 'Full Balayage', price: 180, duration: 150, description: 'Hand-painted highlights for a natural, sun-kissed look.', staffCount: 2 },
      { id: '5', name: 'Root Retouch', price: 75, duration: 90, description: 'Color application to roots only to cover gray or regrowth.', staffCount: 4 }
    ]
  }
])
</script>
