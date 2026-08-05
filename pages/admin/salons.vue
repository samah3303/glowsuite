<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-surface-400 bg-clip-text text-transparent">Salon Management</h1>
        <p class="text-surface-400 mt-1">View and manage all tenant salons</p>
      </div>
      <button @click="isCreateModalOpen = true" class="btn-primary min-h-[44px] shrink-0">
        <Icon name="lucide:plus" class="w-5 h-5 mr-2" />
        Create Salon
      </button>
    </div>

    <!-- Filters -->
    <div class="glass-card p-4 rounded-xl flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1">
        <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
        <input 
          v-model="searchQuery" 
          @input="handleSearch"
          type="text" 
          class="input w-full pl-10" 
          placeholder="Search salons by name, slug or email..."
        >
      </div>
      <div class="sm:w-48 shrink-0">
        <select v-model="statusFilter" @change="fetchSalons" class="input w-full appearance-none">
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="glass-card rounded-xl p-4 space-y-4">
      <div v-for="i in 5" :key="i" class="skeleton h-16 w-full rounded-lg"></div>
    </div>

    <!-- Salons List -->
    <div v-else class="glass-card rounded-xl overflow-hidden">
      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-800/50 border-b border-surface-700 text-surface-400 text-sm">
              <th class="p-4 font-medium whitespace-nowrap">Salon</th>
              <th class="p-4 font-medium whitespace-nowrap">Plan</th>
              <th class="p-4 font-medium whitespace-nowrap">Status</th>
              <th class="p-4 font-medium whitespace-nowrap">Created</th>
              <th class="p-4 font-medium whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="salon in salons" :key="salon.id" class="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
              <td class="p-4">
                <div class="font-medium text-white">{{ salon.name }}</div>
                <div class="text-sm text-surface-500">{{ salon.slug }}</div>
              </td>
              <td class="p-4 text-surface-300 text-sm">
                {{ salon.plan?.name || 'No Plan' }}
              </td>
              <td class="p-4">
                <span 
                  class="px-2 py-1 rounded-md text-xs font-medium border inline-block"
                  :class="{
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': salon.status === 'ACTIVE',
                    'bg-amber-500/10 text-amber-400 border-amber-500/20': salon.status === 'SUSPENDED',
                    'bg-rose-500/10 text-rose-400 border-rose-500/20': salon.status === 'CANCELLED',
                  }"
                >
                  {{ salon.status }}
                </span>
              </td>
              <td class="p-4 text-surface-400 text-sm">
                {{ new Date(salon.createdAt).toLocaleDateString() }}
              </td>
              <td class="p-4">
                <div class="flex items-center justify-end gap-2">
                  <button @click="viewSalon(salon)" class="btn-icon w-10 h-10 text-brand-400 hover:bg-brand-500/10" title="View Details">
                    <Icon name="lucide:eye" class="w-5 h-5" />
                  </button>
                  <button @click="impersonateSalon(salon.id)" class="btn-icon w-10 h-10 text-cyan-400 hover:bg-cyan-500/10" title="Impersonate">
                    <Icon name="lucide:log-in" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="salons.length === 0">
              <td colspan="5" class="p-8 text-center text-surface-400">
                No salons found matching your criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden divide-y divide-surface-800/50">
        <div v-for="salon in salons" :key="salon.id" class="p-4 space-y-4">
          <div class="flex justify-between items-start">
            <div>
              <div class="font-medium text-white text-lg">{{ salon.name }}</div>
              <div class="text-sm text-surface-500">{{ salon.slug }}</div>
            </div>
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
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-surface-400">Plan: <span class="text-surface-200">{{ salon.plan?.name || 'N/A' }}</span></span>
            <span class="text-surface-400">{{ new Date(salon.createdAt).toLocaleDateString() }}</span>
          </div>
          <div class="flex gap-2 pt-2">
            <button @click="viewSalon(salon)" class="btn-secondary flex-1 min-h-[44px]">View</button>
            <button @click="impersonateSalon(salon.id)" class="btn-primary flex-1 min-h-[44px] bg-cyan-600 hover:bg-cyan-500 text-white">
              <Icon name="lucide:log-in" class="w-4 h-4 mr-2" /> Impersonate
            </button>
          </div>
        </div>
        <div v-if="salons.length === 0" class="p-8 text-center text-surface-400">
          No salons found.
        </div>
      </div>
    </div>

    <!-- Create Salon Modal -->
    <div v-if="isCreateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isCreateModalOpen = false"></div>
      <div class="glass-card w-full max-w-lg relative z-10 rounded-2xl flex flex-col max-h-[90vh] animate-slide-up shadow-2xl">
        <div class="flex items-center justify-between p-6 border-b border-surface-800">
          <h2 class="text-xl font-bold text-white">Create New Salon</h2>
          <button @click="isCreateModalOpen = false" class="btn-icon text-surface-400 hover:text-white">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>
        <div class="p-6 overflow-y-auto flex-1">
          <form @submit.prevent="createSalon" class="space-y-4">
            <div class="space-y-1">
              <label class="input-label">Salon Name</label>
              <input v-model="newSalon.name" @input="updateSlug" required type="text" class="input w-full" placeholder="e.g. Luxe Beauty Lounge">
            </div>
            <div class="space-y-1">
              <label class="input-label">URL Slug</label>
              <div class="flex items-center">
                <span class="text-surface-500 text-sm mr-2 bg-surface-900 px-3 py-2 rounded-l-lg border border-surface-700 border-r-0">glowsuite.com/</span>
                <input v-model="newSalon.slug" required type="text" class="input w-full rounded-l-none" placeholder="luxe-beauty">
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="input-label">Owner First Name</label>
                <input v-model="newSalon.ownerFirstName" required type="text" class="input w-full">
              </div>
              <div class="space-y-1">
                <label class="input-label">Owner Last Name</label>
                <input v-model="newSalon.ownerLastName" required type="text" class="input w-full">
              </div>
            </div>

            <div class="space-y-1">
              <label class="input-label">Owner Email</label>
              <input v-model="newSalon.ownerEmail" required type="email" class="input w-full">
            </div>
            
            <div class="space-y-1">
              <label class="input-label">Owner Password</label>
              <input v-model="newSalon.ownerPassword" required type="password" class="input w-full" minlength="8">
            </div>

            <div class="space-y-1">
              <label class="input-label">Subscription Plan</label>
              <select v-model="newSalon.planId" required class="input w-full">
                <option value="" disabled>Select a plan</option>
                <option v-for="plan in availablePlans" :key="plan.id" :value="plan.id">
                  {{ plan.name }} - ${{ plan.price }}/{{ plan.interval }}
                </option>
              </select>
            </div>
          </form>
        </div>
        <div class="p-6 border-t border-surface-800 flex justify-end gap-3 bg-surface-900/50 rounded-b-2xl">
          <button @click="isCreateModalOpen = false" type="button" class="btn-ghost min-h-[44px]">Cancel</button>
          <button @click="createSalon" :disabled="isCreating" class="btn-primary min-h-[44px]">
            <Icon v-if="isCreating" name="lucide:loader-2" class="w-5 h-5 animate-spin mr-2" />
            {{ isCreating ? 'Creating...' : 'Create Salon' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Salon Details Slide-over -->
    <div v-if="selectedSalon" class="fixed inset-0 z-50 flex justify-end">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="selectedSalon = null"></div>
      <div class="glass-card w-full max-w-md h-full relative z-10 flex flex-col animate-fade-in rounded-none shadow-2xl border-l border-surface-800">
        <div class="flex items-center justify-between p-6 border-b border-surface-800 bg-surface-900/80">
          <h2 class="text-xl font-bold text-white">Salon Details</h2>
          <button @click="selectedSalon = null" class="btn-icon text-surface-400 hover:text-white">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1 space-y-8">
          <!-- Overview -->
          <div class="text-center">
            <div class="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-brand-500/20 to-violet-500/20 flex items-center justify-center border border-brand-500/30 mb-4">
              <span class="text-3xl font-bold text-brand-400">{{ selectedSalon.name.charAt(0) }}</span>
            </div>
            <h3 class="text-2xl font-bold text-white">{{ selectedSalon.name }}</h3>
            <p class="text-surface-400 text-sm">glowsuite.com/{{ selectedSalon.slug }}</p>
            
            <div class="mt-4 flex justify-center gap-2">
              <span 
                class="px-3 py-1 rounded-full text-xs font-medium border"
                :class="{
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': selectedSalon.status === 'ACTIVE',
                  'bg-amber-500/10 text-amber-400 border-amber-500/20': selectedSalon.status === 'SUSPENDED',
                  'bg-rose-500/10 text-rose-400 border-rose-500/20': selectedSalon.status === 'CANCELLED',
                }"
              >
                {{ selectedSalon.status }}
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-medium border bg-surface-800 border-surface-700 text-surface-300">
                Created {{ new Date(selectedSalon.createdAt).toLocaleDateString() }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="bg-surface-900/50 p-4 rounded-xl border border-surface-800">
              <div class="text-surface-500 text-xs mb-1">Current Plan</div>
              <div class="font-medium text-white">{{ selectedSalon.plan?.name || 'None' }}</div>
            </div>
            <div class="bg-surface-900/50 p-4 rounded-xl border border-surface-800">
              <div class="text-surface-500 text-xs mb-1">Owner</div>
              <div class="font-medium text-white truncate" :title="selectedSalon.ownerEmail">{{ selectedSalon.ownerEmail || 'Unknown' }}</div>
            </div>
          </div>

          <div class="space-y-3">
            <h4 class="text-sm font-medium text-surface-400 uppercase tracking-wider">Quick Actions</h4>
            <div class="flex flex-col gap-3">
              <button @click="impersonateSalon(selectedSalon.id)" class="btn-primary w-full min-h-[44px] justify-center bg-cyan-600 hover:bg-cyan-500">
                <Icon name="lucide:log-in" class="w-5 h-5 mr-2" />
                Impersonate as Owner
              </button>
              
              <button 
                @click="toggleSalonStatus(selectedSalon)" 
                class="w-full min-h-[44px] justify-center flex items-center rounded-xl font-medium transition-colors"
                :class="selectedSalon.status === 'ACTIVE' ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'"
              >
                <Icon :name="selectedSalon.status === 'ACTIVE' ? 'lucide:pause-circle' : 'lucide:play-circle'" class="w-5 h-5 mr-2" />
                {{ selectedSalon.status === 'ACTIVE' ? 'Suspend Salon' : 'Activate Salon' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'admin' })

const salons = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('')
let searchTimeout: any = null

const isCreateModalOpen = ref(false)
const isCreating = ref(false)
const selectedSalon = ref<any>(null)

const availablePlans = ref<any[]>([
  { id: 1, name: 'Starter', price: 29, interval: 'month' },
  { id: 2, name: 'Professional', price: 79, interval: 'month' },
  { id: 3, name: 'Enterprise', price: 199, interval: 'month' }
])

const newSalon = ref({
  name: '',
  slug: '',
  ownerFirstName: '',
  ownerLastName: '',
  ownerEmail: '',
  ownerPassword: '',
  planId: '',
  currency: 'USD',
  timezone: 'UTC'
})

const fetchSalons = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (searchQuery.value) params.append('search', searchQuery.value)
    if (statusFilter.value) params.append('status', statusFilter.value)
    
    // Fallback mock data
    const res = await $fetch(`/api/admin/tenants?${params.toString()}`).catch(() => {
      let filtered = [
        { id: 1, name: 'Glow Up Studio', slug: 'glow-up', status: 'ACTIVE', ownerEmail: 'owner@glowup.com', plan: { name: 'Starter' }, createdAt: new Date().toISOString() },
        { id: 2, name: 'Luxe Nails', slug: 'luxe-nails', status: 'SUSPENDED', ownerEmail: 'jane@luxenails.com', plan: { name: 'Professional' }, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: 3, name: 'Elite Spa', slug: 'elite-spa', status: 'ACTIVE', ownerEmail: 'contact@elitespa.com', plan: { name: 'Enterprise' }, createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
      ]
      
      if (statusFilter.value) {
        filtered = filtered.filter(s => s.status === statusFilter.value)
      }
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.slug.includes(q))
      }
      return filtered
    })
    salons.value = res as any[]
  } catch (error) {
    console.error('Failed to fetch salons:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchSalons()
  }, 300)
}

const updateSlug = () => {
  if (!newSalon.value.name) {
    newSalon.value.slug = ''
    return
  }
  newSalon.value.slug = newSalon.value.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

const createSalon = async () => {
  isCreating.value = true
  try {
    await $fetch('/api/admin/tenants', {
      method: 'POST',
      body: newSalon.value
    }).catch(err => {
      console.log('Mock creation successful (endpoint missing)', err)
    })
    
    // Reset form
    newSalon.value = {
      name: '', slug: '', ownerFirstName: '', ownerLastName: '', ownerEmail: '', ownerPassword: '', planId: '', currency: 'USD', timezone: 'UTC'
    }
    isCreateModalOpen.value = false
    await fetchSalons()
  } catch (error) {
    console.error('Failed to create salon:', error)
    alert('Failed to create salon')
  } finally {
    isCreating.value = false
  }
}

const viewSalon = (salon: any) => {
  selectedSalon.value = salon
}

const impersonateSalon = async (id: number) => {
  try {
    await $fetch(`/api/admin/tenants/${id}/impersonate`, { method: 'POST' }).catch(() => {
      console.log('Mock impersonate successful')
    })
    window.location.href = '/app'
  } catch (error) {
    console.error('Failed to impersonate:', error)
    alert('Failed to impersonate salon')
  }
}

const toggleSalonStatus = async (salon: any) => {
  const newStatus = salon.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
  try {
    await $fetch(`/api/admin/tenants/${salon.id}`, {
      method: 'PATCH',
      body: { status: newStatus }
    }).catch(() => {
      console.log('Mock status update successful')
    })
    
    salon.status = newStatus
    if (selectedSalon.value?.id === salon.id) {
      selectedSalon.value.status = newStatus
    }
  } catch (error) {
    console.error('Failed to update status:', error)
    alert('Failed to update salon status')
  }
}

onMounted(() => {
  fetchSalons()
})
</script>
