<template>

  <Html lang="pt-br">
    <Head>
      <Meta name="description" content="Titulo" />
      <Meta charset="utf-8" />
      <Meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <Meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <Link rel="icon" href="/images/logo/128w/ICON_2_128w.png" />

      <Link 
        v-for="index in 21" 
        :key="`pack-image-${index}`" 
        rel="prefetch" 
        as="image" 
        :href="`/images/general/pack-illustrations/${index < 10 ? `0${index}` : index}.svg`" 
      />

    </Head>
    <Body id="body" class="w-screen h-screen font-sans bg-slate-100 text-zinc-700 overflow-x-hidden scrolling-touch relative">

      <AppPageHeader></AppPageHeader>
      <NuxtLayout>
        <NuxtPage/>
      </NuxtLayout>
      <AppFooter></AppFooter>

      <ModalContactForm />
      <ContentDrawer />

      <AppNotifications />

    </Body>
  </Html>
</template>

<script setup>
  import '@/assets/css/main.scss'
  import { useAuthStore } from "@/modules/auth/store"
  import ModalContactForm from '@/modules/general/ModalContactForm.vue'
  import ContentDrawer from '@/modules/general/ContentDrawer.vue'
  
  const authStore = useAuthStore()
  const route = useRoute()

  if(process.client) {
    
    onMounted(() => {
      if (route.query.googleAuthToken) {
        authStore.googleLogin(route.query.googleAuthToken)
      }

      if(authStore.loggedUser) {
        authStore.getLoggedUser()
      }
    })

  }

  useHead({
    titleTemplate: '%sCálculo e Previdência',
    bodyAttrs: {
      class: 'test'
    }
  })

</script>

<style lang="scss">
  .page-enter-from, .layout-enter-from {
    opacity: 0;
  }

  .page-enter-active,
  .page-leave-active,
  .layout-enter-active, 
  .layout-leave-active {
    transition: all 0.3s;
  }
  .page-enter,
  .page-leave-to,
  .layout-enter, 
  .layout-leave-active {
    opacity: 0;
    transform: translateX(-100px);
  }

</style>

