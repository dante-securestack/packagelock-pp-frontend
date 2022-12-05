<template>
  <nav class="
    fixed
    top-0
    right-0
    left-0
    z-40
    w-full
    px-6
    md:px-20
    xl:px-28
    flex
    flex-wrap
    justify-between
    items-center
    h-24
    font-sans
  "
  :class="headerClasses"
  id="page-header"
  >
    <div class=" flex">
      <nuxt-link to="/">
        <img src="/images/logo/1x/LOGO_2_1_1x.png" class="h-14" alt="Logo Calculo e previdência"/>
      </nuxt-link>
    </div>

    <div class="flex items-center space-x-6">
      <NuxtLink to="/calcule-sua-aposentadoria">
        <AppButton class="hidden lg:block bg-amber-600 text-white rounded-full px-6">
          Calcule sua aposentadoria
        </AppButton>
      </NuxtLink> 

      <AppButton 
        @click="emitter.emit('openContactModal')"
        class="sm:block w-auto hidden md:block bg-amber-600 text-white rounded-full px-6"
      >
        Revisão da Vida Toda
      </AppButton>

      <button 
        @click.stop="toggleMenu()"
        class="menu-toggle" 
        :class="{ 'active' : showMenu }"
      >
        <span class="menu-toggle-bar"></span>
        <span class="menu-toggle-bar"></span>
        <span class="menu-toggle-bar"></span>
      </button>
    </div>

    <AppAside ref="childred"  v-model:showMenu="showMenu" />
  </nav>
</template>

<script setup>

  const route = useRoute()
  const emitter = useEmitter()

  const childred  = ref()

  const showMenu = ref(false)

  const toggleMenu = () => {
    childred.value.toggleDrawer()
  }

  const headerClasses = computed(() => {
    if(route.path === '/') return 'bg-cyan-800'
    return 'bg-brand-gradient shadow-xl'
  })

</script>

<style lang="scss">

</style>