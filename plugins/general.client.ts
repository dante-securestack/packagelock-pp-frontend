
import setupDirectives from '@/setup/directives'
import setupComponents from '@/setup/components'
import setupGlobals from '@/setup/globals'
import setupRouterHooks from '@/setup/routerHooks'
import { Cache as MemoryCache } from 'memory-cache'

import { inject as initVercelAnalytics } from '@vercel/analytics'

export default defineNuxtPlugin((nuxtApp) => {
  setupDirectives(nuxtApp.vueApp)
  setupComponents(nuxtApp.vueApp)
  setupGlobals(nuxtApp.vueApp)
  setupRouterHooks()
  initVercelAnalytics()
  window.$memoryCache = new MemoryCache()
})