<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-surface-400 bg-clip-text text-transparent">Subscription Plans</h1>
        <p class="text-surface-400 mt-1">Manage pricing tiers and limits</p>
      </div>
      <button @click="openCreateModal" class="btn-primary min-h-[44px] shrink-0">
        <Icon name="lucide:plus" class="w-5 h-5 mr-2" />
        Create Plan
      </button>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="glass-card rounded-2xl h-[400px] p-6">
        <div class="skeleton w-full h-full rounded-xl"></div>
      </div>
    </div>

    <!-- Plans Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="plan in plans" :key="plan.id" class="glass-card rounded-2xl p-6 flex flex-col relative overflow-hidden group">
        
        <!-- Popular Indicator -->
        <div v-if="plan.isPopular" class="absolute top-0 right-0 bg-brand-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
          Most Popular
        </div>
        
        <div class="mb-4">
          <h2 class="text-xl font-bold text-white mb-2">{{ plan.displayName || plan.name }}</h2>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-bold text-white">${{ plan.price }}</span>
            <span class="text-surface-400 text-sm">/{{ plan.interval }}</span>
          </div>
        </div>

        <div class="mb-6 flex-1 space-y-4">
          <div class="flex items-center gap-3 text-sm">
            <Icon name="lucide:map-pin" class="w-5 h-5 text-brand-400" />
            <span class="text-surface-300">Up to <strong class="text-white">{{ plan.maxLocations }}</strong> Locations</span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <Icon name="lucide:users" class="w-5 h-5 text-brand-400" />
            <span class="text-surface-300">Up to <strong class="text-white">{{ plan.maxStaff }}</strong> Staff Members</span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <Icon name="lucide:sparkles" class="w-5 h-5 text-brand-400" />
            <span class="text-surface-300">Up to <strong class="text-white">{{ plan.maxServices }}</strong> Services</span>
          </div>
        </div>

        <div class="mt-auto pt-6 border-t border-surface-800/50 flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-xs text-surface-500 uppercase tracking-wider">Subscribers</span>
            <span class="font-bold text-white">{{ plan.activeSubscribers || 0 }}</span>
          </div>
          <button @click="openEditModal(plan)" class="btn-secondary min-h-[44px]">
            <Icon name="lucide:edit" class="w-4 h-4 mr-2" />
            Edit Plan
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isModalOpen = false"></div>
      <div class="glass-card w-full max-w-lg relative z-10 rounded-2xl flex flex-col max-h-[90vh] animate-slide-up shadow-2xl">
        <div class="flex items-center justify-between p-6 border-b border-surface-800">
          <h2 class="text-xl font-bold text-white">{{ editingPlan ? 'Edit Plan' : 'Create Plan' }}</h2>
          <button @click="isModalOpen = false" class="btn-icon text-surface-400 hover:text-white">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1">
          <form @submit.prevent="savePlan" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="input-label">Internal Name</label>
                <input v-model="form.name" required type="text" class="input w-full" placeholder="pro-monthly">
              </div>
              <div class="space-y-1">
                <label class="input-label">Display Name</label>
                <input v-model="form.displayName" required type="text" class="input w-full" placeholder="Professional">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="input-label">Price</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">$</span>
                  <input v-model="form.price" required type="number" step="0.01" class="input w-full pl-8">
                </div>
              </div>
              <div class="space-y-1">
                <label class="input-label">Interval</label>
                <select v-model="form.interval" required class="input w-full">
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>
            </div>

            <div class="space-y-1 border-t border-surface-800 pt-4 mt-2">
              <h3 class="text-sm font-medium text-white mb-3">Feature Limits</h3>
              
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-sm text-surface-300">Max Locations</label>
                  <input v-model="form.maxLocations" required type="number" class="input w-24 text-right">
                </div>
                <div class="flex items-center justify-between">
                  <label class="text-sm text-surface-300">Max Staff Members</label>
                  <input v-model="form.maxStaff" required type="number" class="input w-24 text-right">
                </div>
                <div class="flex items-center justify-between">
                  <label class="text-sm text-surface-300">Max Services</label>
                  <input v-model="form.maxServices" required type="number" class="input w-24 text-right">
                </div>
              </div>
            </div>

            <div class="flex items-center mt-4">
              <input type="checkbox" id="isActive" v-model="form.isActive" class="w-4 h-4 rounded bg-surface-900 border-surface-700 text-brand-500 focus:ring-brand-500 focus:ring-offset-surface-950">
              <label for="isActive" class="ml-2 text-sm text-surface-300">Plan is active and available for new subscriptions</label>
            </div>
            
            <div class="flex items-center mt-2">
              <input type="checkbox" id="isPopular" v-model="form.isPopular" class="w-4 h-4 rounded bg-surface-900 border-surface-700 text-brand-500 focus:ring-brand-500 focus:ring-offset-surface-950">
              <label for="isPopular" class="ml-2 text-sm text-surface-300">Highlight as most popular plan</label>
            </div>
          </form>
        </div>
        
        <div class="p-6 border-t border-surface-800 flex justify-end gap-3 bg-surface-900/50 rounded-b-2xl">
          <button @click="isModalOpen = false" type="button" class="btn-ghost min-h-[44px]">Cancel</button>
          <button @click="savePlan" :disabled="isSaving" class="btn-primary min-h-[44px]">
            <Icon v-if="isSaving" name="lucide:loader-2" class="w-5 h-5 animate-spin mr-2" />
            {{ isSaving ? 'Saving...' : 'Save Plan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'admin' })

const plans = ref<any[]>([])
const loading = ref(true)

const isModalOpen = ref(false)
const isSaving = ref(false)
const editingPlan = ref<any>(null)

const defaultForm = {
  name: '',
  displayName: '',
  price: 0,
  interval: 'month',
  maxLocations: 1,
  maxStaff: 5,
  maxServices: 20,
  isActive: true,
  isPopular: false
}
const form = ref({ ...defaultForm })

const fetchPlans = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/admin/plans').catch(() => {
      // Mock data
      return [
        { id: 1, name: 'starter-monthly', displayName: 'Starter', price: 29, interval: 'month', maxLocations: 1, maxStaff: 3, maxServices: 15, isActive: true, isPopular: false, activeSubscribers: 42 },
        { id: 2, name: 'pro-monthly', displayName: 'Professional', price: 79, interval: 'month', maxLocations: 3, maxStaff: 10, maxServices: 50, isActive: true, isPopular: true, activeSubscribers: 128 },
        { id: 3, name: 'enterprise-monthly', displayName: 'Enterprise', price: 199, interval: 'month', maxLocations: 10, maxStaff: 50, maxServices: 999, isActive: true, isPopular: false, activeSubscribers: 15 }
      ]
    })
    plans.value = res as any[]
  } catch (error) {
    console.error('Failed to fetch plans:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingPlan.value = null
  form.value = { ...defaultForm }
  isModalOpen.value = true
}

const openEditModal = (plan: any) => {
  editingPlan.value = plan
  form.value = { ...plan }
  isModalOpen.value = true
}

const savePlan = async () => {
  isSaving.value = true
  try {
    if (editingPlan.value) {
      await $fetch(`/api/admin/plans/${editingPlan.value.id}`, {
        method: 'PATCH',
        body: form.value
      }).catch(() => console.log('Mock edit success'))
    } else {
      await $fetch('/api/admin/plans', {
        method: 'POST',
        body: form.value
      }).catch(() => console.log('Mock create success'))
    }
    isModalOpen.value = false
    await fetchPlans()
  } catch (error) {
    console.error('Failed to save plan:', error)
    alert('Failed to save plan')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchPlans()
})
</script>
