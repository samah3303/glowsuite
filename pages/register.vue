<template>
  <div class="glass-card p-6 md:p-8 rounded-2xl w-full relative overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-violet-500"></div>
    
    <div class="text-center mb-6">
      <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-surface-400 bg-clip-text text-transparent mb-2">Create your salon</h1>
      <p class="text-surface-400 text-sm">Start managing your business in minutes</p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div v-if="error" class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm animate-fade-in">
        <Icon name="lucide:alert-circle" class="w-4 h-4 flex-shrink-0" />
        {{ error }}
      </div>

      <div class="space-y-1">
        <label class="input-label">Salon Name</label>
        <div class="relative">
          <Icon name="lucide:briefcase" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 w-5 h-5 pointer-events-none" />
          <input v-model="form.salonName" type="text" required class="input w-full pl-10" placeholder="Glow Studio" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="input-label">First Name</label>
          <div class="relative">
            <Icon name="lucide:user" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 w-5 h-5 pointer-events-none" />
            <input v-model="form.firstName" type="text" required class="input w-full pl-10" placeholder="Jane" />
          </div>
        </div>
        <div class="space-y-1">
          <label class="input-label">Last Name</label>
          <div class="relative">
            <Icon name="lucide:user" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 w-5 h-5 pointer-events-none opacity-0" />
            <input v-model="form.lastName" type="text" required class="input w-full md:pl-3 pl-10" placeholder="Doe" />
          </div>
        </div>
      </div>

      <div class="space-y-1">
        <label class="input-label">Email</label>
        <div class="relative">
          <Icon name="lucide:mail" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 w-5 h-5 pointer-events-none" />
          <input v-model="form.email" type="email" required class="input w-full pl-10" placeholder="you@example.com" />
        </div>
      </div>

      <div class="space-y-1">
        <label class="input-label">Password</label>
        <div class="relative">
          <Icon name="lucide:lock" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 w-5 h-5 pointer-events-none" />
          <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required class="input w-full pl-10 pr-10" placeholder="••••••••" minlength="8" />
          <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2">
            <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="pt-2">
        <button type="submit" :disabled="auth.isLoading" class="btn-primary w-full h-12 text-base font-medium">
          <Icon v-if="auth.isLoading" name="lucide:loader-2" class="w-5 h-5 animate-spin mr-2" />
          {{ auth.isLoading ? 'Creating account...' : 'Create Account' }}
        </button>
      </div>
    </form>

    <div class="mt-6 text-center text-sm text-surface-400">
      Already have an account? 
      <NuxtLink to="/login" class="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
import { ref, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const form = reactive({
  salonName: '',
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})
const showPassword = ref(false)
const error = ref('')

const handleRegister = async () => {
  error.value = ''
  try {
    await auth.register(form.salonName, form.email, form.password, form.firstName, form.lastName)
    navigateTo('/app')
  } catch (e: any) {
    error.value = e.data?.message || 'An error occurred during registration'
  }
}
</script>
