<template>
  <div class="min-h-screen bg-surface-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
    <!-- Background floating gradients -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-900/30 blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-900/20 blur-[120px] pointer-events-none"></div>
    
    <!-- Container with inline logo flow -->
    <div class="w-full max-w-md my-auto py-8 z-10 animate-fade-in relative flex flex-col items-center gap-6">
      <div class="flex items-center gap-2">
        <Icon name="lucide:scissors" class="w-8 h-8 text-brand-400" />
        <span class="text-2xl font-bold bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">GlowSuite</span>
      </div>
      
      <main class="w-full">
        <slot />
      </main>
    </div>
  </div>
</template>
