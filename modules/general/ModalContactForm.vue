<template>
  <AppBaseModal :show="showContactModal" @close="close">
    
    <div class="flex flex-col space-y-6">

      <h3 class="h3 border-l-10 border-orange-500 pl-6 leading-normal ">
        <span>Fale conosco</span>
      </h3>

      <p class="p">Fale diretamente com nossos especialistas previdenciários para <b>calcular sua aposentadoria</b> ou <b>Revisão da Vida Toda</b>.</p>

      <div class="w-full flex flex-col space-y-6">

        <AppButton 
          class="w-full flex p-0 shadow-md hover:shadow-lg bg-cyan-800/5"
          @click="openWhatsapp()"  
        >
          <div class="w-1/5 flex flex-wrap items-center justify-center p-4 sm:p-8">
            <img src="/icons/contact/whatsapp.png" />
          </div>
          <div class="w-4/5 p-6 text-left">
            <p>Entrar em contato por WhatsApp</p>
            <h5 class="h5">(31) 98797-1362</h5>
          </div>
        </AppButton>
        <AppButton 
          @click="openCall()"
          class="w-full flex p-0 shadow-md hover:shadow-lg bg-cyan-800/5"
        >
          <div class="w-1/5 flex flex-wrap items-center justify-center p-4 sm:p-8">
            <img src="/icons/contact/phone.png" />
          </div>
          <div class="w-4/5 p-6 text-left">
            <p>Entrar em contato por telefone</p>
            <h5 class="h5">(31) 3261-4610</h5>
          </div>
        </AppButton>
        <AppButton 
          class="w-full flex p-0 shadow-md hover:shadow-lg bg-cyan-800/5"
          @click="openEmail()"
        >
          <div class="w-1/5 flex flex-wrap items-center justify-center p-4 sm:p-8">
            <img src="/icons/contact/email.png" />
          </div>
          <div class="w-4/5 p-6 text-left">
            <p>Entrar em contato por email</p>
            <h5 class="h5 break-words">calculoeprevidencia@gmail.com</h5>
          </div>
        </AppButton>

      </div>
    </div>
  </AppBaseModal>
</template>

<script setup>
  
  const emitter = useEmitter()
  const vueInstance = useVueInstance()

  const showContactModal = ref(false)

  onMounted(() => {
    emitter.on('openContactModal', () => {
      showContactModal.value = true
    })
  })

  onBeforeUnmount(() => {
    emitter.off('openContactModal')
  })

  const close = () => {
    showContactModal.value = false
  }

  const openWhatsapp = () => {
    const message = `Olá, gostaria de saber informações sobre aposentadoria.`
    let url = `https://api.whatsapp.com/send?phone=553187971362&text=${encodeURIComponent(message)}\n`;            
    setTimeout(() => {
      window.open(url, '_system', null)
      vueInstance.config.globalProperties.$gtag.event('CONTATO_WHATSAPP', { event_category: 'INTERAÇÕES' })
    },100)
  }

  const openCall = () => {           
    setTimeout(() => {
      window.open( `tel:0313261-4610`, '_system', null)
      vueInstance.config.globalProperties.$gtag.event('CONTATO_TELEFONE', { event_category: 'INTERAÇÕES' })
    },100)
  }

  const openEmail = () => {           
    setTimeout(() => {
      window.open( `mailto:calculoeprevidencia@gmail.com`, '_system', null)
      vueInstance.config.globalProperties.$gtag.event('CONTATO_EMAIL', { event_category: 'INTERAÇÕES' })
    },100)
  }

</script>
