// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'GlowSuite — Salon Management',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'description', content: 'Premium salon management SaaS platform. Manage appointments, staff, services, and multiple locations.' },
        { name: 'theme-color', content: '#0F172A' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'glowsuite-dev-secret-change-in-production-2026',
    public: {
      appName: 'GlowSuite',
    },
  },

  tailwindcss: {
    configPath: 'tailwind.config.ts',
  },

  nitro: {
    experimental: {
      asyncContext: true,
    },
  },
})
