<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h1 class="text-2xl font-bold text-surface-50">Team Members</h1>
      <button class="btn-primary flex items-center justify-center gap-2 min-h-[44px]">
        <Icon name="lucide:user-plus" class="w-4 h-4" /> Add Staff
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="staff in staffMembers" :key="staff.id" class="glass-card p-6 flex flex-col items-center text-center relative group">
        
        <div class="absolute top-4 right-4">
          <button class="text-surface-500 hover:text-brand-400 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-surface-800 transition-colors">
            <Icon name="lucide:edit-2" class="w-4 h-4" />
          </button>
        </div>

        <div class="relative mb-4">
          <div class="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg border-4 border-surface-900" :style="{ backgroundColor: staff.color }">
            {{ staff.initials }}
          </div>
          <div class="absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-surface-900" 
               :class="staff.isActive ? 'bg-emerald-500' : 'bg-surface-500'"></div>
        </div>

        <h3 class="text-lg font-semibold text-surface-50 mb-1">{{ staff.name }}</h3>
        <p class="text-sm text-brand-400 font-medium mb-4">{{ staff.title }}</p>

        <div class="w-full grid grid-cols-2 gap-2 border-t border-surface-800 pt-4">
          <div class="flex flex-col items-center">
            <span class="text-xs text-surface-400 mb-1">Location</span>
            <span class="text-sm font-medium text-surface-200">{{ staff.location }}</span>
          </div>
          <div class="flex flex-col items-center border-l border-surface-800">
            <span class="text-xs text-surface-400 mb-1">Services</span>
            <span class="text-sm font-medium text-surface-200">{{ staff.serviceCount }} assigned</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const staffMembers = ref([
  { id: '1', name: 'Jessica Taylor', title: 'Senior Stylist', initials: 'JT', color: '#8b5cf6', location: 'Downtown', serviceCount: 12, isActive: true },
  { id: '2', name: 'David Kim', title: 'Master Barber', initials: 'DK', color: '#3b82f6', location: 'Downtown', serviceCount: 8, isActive: true },
  { id: '3', name: 'Emma Watson', title: 'Color Specialist', initials: 'EW', color: '#f59e0b', location: 'Westside', serviceCount: 6, isActive: false },
])
</script>
