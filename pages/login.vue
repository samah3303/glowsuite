<template>
  <div class="glass-card p-8 rounded-2xl w-full relative overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-violet-500"></div>
    
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-white to-surface-400 bg-clip-text text-transparent mb-2">Welcome back</h1>
      <p class="text-surface-400 text-sm">Sign in to manage your salon</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div v-if="error" class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm animate-fade-in">
        <Icon name="lucide:alert-circle" class="w-4 h-4 flex-shrink-0" />
        {{ error }}
      </div>

      <div class="space-y-1">
        <label class="input-label">Email</label>
        <div class="relative">
          <Icon name="lucide:mail" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 w-5 h-5 pointer-events-none" />
          <input v-model="email" type="email" required class="input w-full pl-10" placeholder="you@example.com" />
        </div>
      </div>

      <div class="space-y-1">
        <label class="input-label">Password</label>
        <div class="relative">
          <Icon name="lucide:lock" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 w-5 h-5 pointer-events-none" />
          <input v-model="password" :type="showPassword ? 'text' : 'password'" required class="input w-full pl-10 pr-10" placeholder="••••••••" />
          <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2">
            <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="pt-2">
        <button type="submit" :disabled="auth.isLoading" class="btn-primary w-full h-12 text-base font-medium">
          <Icon v-if="auth.isLoading" name="lucide:loader-2" class="w-5 h-5 animate-spin mr-2" />
          {{ auth.isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </div>
    </form>

    <div class="mt-6 text-center text-sm text-surface-400">
      Don't have an account? 
      <NuxtLink to="/register" class="text-brand-400 hover:text-brand-300 font-medium transition-colors">Create one</NuxtLink>
    </div>

    <div class="mt-8 flex items-center justify-center gap-4">
      <div class="h-px bg-surface-700/50 flex-1"></div>
      <span class="text-surface-500 text-xs font-medium uppercase tracking-wider">Super Admin?</span>
      <div class="h-px bg-surface-700/50 flex-1"></div>
    </div>
    
    <div class="mt-4 text-center text-sm text-surface-400">
      Sign in above. You will be automatically redirected to the admin panel.
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  try {
    await auth.login(email.value, password.value)
    navigateTo('/app')
  } catch (e: any) {
    error.value = e.data?.message || 'Invalid email or password'
  }
}
</script>
