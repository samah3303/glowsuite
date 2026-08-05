<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full md:w-auto px-4 md:px-0">
    <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
      <div v-for="toast in toasts" :key="toast.id" 
           class="glass-card-sm flex items-center p-4 min-h-[44px] shadow-lg border border-surface-700 animate-slide-up"
           :class="{'border-l-4 border-l-brand-500': toast.type === 'info', 'border-l-4 border-l-emerald-500': toast.type === 'success', 'border-l-4 border-l-red-500': toast.type === 'error'}">
        <Icon v-if="toast.type === 'success'" name="lucide:check-circle" class="text-emerald-500 w-5 h-5 mr-3 flex-shrink-0" />
        <Icon v-else-if="toast.type === 'error'" name="lucide:x-circle" class="text-red-500 w-5 h-5 mr-3 flex-shrink-0" />
        <Icon v-else name="lucide:info" class="text-brand-500 w-5 h-5 mr-3 flex-shrink-0" />
        
        <p class="text-surface-100 flex-grow text-sm">{{ toast.message }}</p>
        
        <button @click="removeToast(toast.id)" class="ml-4 text-surface-400 hover:text-surface-200 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2">
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts } = useToast()

const removeToast = (id: string) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
