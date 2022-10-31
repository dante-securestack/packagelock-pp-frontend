<template>
  <AppBaseModal :show="showModal" @close="close" :allowClose="false">
    <div class="w-full flex flex-col items-center">
      <img class="w-full -mt-10" src="/images/general/pack-illustrations/07.svg" />
      
      <h5 class="h5 text-center">Aguarde alguns instantes enquanto carregamos seu arquivo CNIS.</h5>
    </div>
  </AppBaseModal>
</template>

<script setup>
  import { getCurrentInstance } from 'vue'

  const { emit } = getCurrentInstance()

  defineEmits(['close'])

  const props = defineProps({
    showModal: Boolean
  })

  const close = () => {
    emit('close')
  }

</script>
