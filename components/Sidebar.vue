<template>
  <!-- Backdrop -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-40 bg-black/50 md:hidden"
    @click="$emit('close')"
  ></div>

  <!-- Sidebar -->
  <div 
    :class="[
      'fixed inset-y-0 left-0 z-50 flex flex-col w-64 h-screen bg-gray-800 border-r border-gray-700 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="p-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-blue-400">GlowSuite</h1>
      <button class="md:hidden text-gray-400 hover:text-white focus:outline-none" @click="$emit('close')">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <nav class="flex-1 px-4 space-y-2">
      <NuxtLink to="/app" class="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors" active-class="bg-gray-700" @click="$emit('close')">
        Dashboard
      </NuxtLink>
      <NuxtLink to="/app/staff" class="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors" active-class="bg-gray-700" @click="$emit('close')">
        Staff
      </NuxtLink>
    </nav>
    <div class="p-4 border-t border-gray-700 text-sm text-gray-400">
      &copy; 2026 GlowSuite
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>
