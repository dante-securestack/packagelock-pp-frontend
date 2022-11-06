import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: false,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: '/api'
    }
  },

  pageTransition: {
    mode: 'out-in'
  },

  build: {

    transpile: ['chart.js'],
    
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        }
      }
    },
  },

  vite: {
    optimizeDeps: {
      exclude: [
        'tailwind.config.js'
      ]
    }
  }
  
})
