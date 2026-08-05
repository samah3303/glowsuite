<template>
  <div class="h-screen w-screen flex items-center justify-center bg-surface-950">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

onMounted(async () => {
  const auth = useAuthStore()
  if (auth.isAuthenticated) {
    navigateTo('/app')
  } else {
    navigateTo('/login')
  }
})
</script>
