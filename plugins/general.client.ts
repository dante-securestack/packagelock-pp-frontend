
import setupDirectives from '@/setup/directives'
import setupComponents from '@/setup/components'
import setupGlobals from '@/setup/globals'
import setupRouterHooks from '@/setup/routerHooks'

export default defineNuxtPlugin((nuxtApp) => {
  setupDirectives(nuxtApp.vueApp)
  setupComponents(nuxtApp.vueApp)
  setupGlobals(nuxtApp.vueApp)
  setupRouterHooks()
})