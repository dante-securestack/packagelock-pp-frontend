<template>
  <AppBaseModal :show="showModal" @close="close" :requireAuth="true">
    <div class="w-full flex flex-col space-y-4">

      <h3 class="h3 border-l-10 border-orange-500 pl-6 leading-normal mb-4">
        Excluir vínculo
      </h3>

      <p>Você tem certeza que deseja excluir o vínculo {{ socialSecurityRelation.relationOrigin }} ?</p>

      <div class="w-full flex justify-end space-x-4 mt-10 block">
        <AppButton @click="close()">Cancelar</AppButton>
        <AppButton bg="bg-brand-gradient" text="text-white" @click="destroy()">
          <span>Excluir</span>
          <AppIcons icon="chevron_right" />
        </AppButton>
      </div>

    </div>
  </AppBaseModal>

</template>

<script setup>
  import { getCurrentInstance } from 'vue'
  import Api from '@/util/Api'
  import SocialSecurityRelation from '@/entities/SocialSecurityRelation'
  import emitter from '@/util/emitter'
  
  const { emit } = getCurrentInstance()
  
  defineEmits(['close'])

  onMounted(() => {
    emitter.on('openRelationExcludeModal', ({ socialSecurityRelation: socialSecurityRelationToSet }) => {
      showModal.value = true
      socialSecurityRelation.value = new SocialSecurityRelation(socialSecurityRelationToSet)
    })
  })

  onBeforeUnmount(() => {
    emitter.off('openRelationExcludeModal')
  })

  const showModal = ref(false)
  const socialSecurityRelation = ref(new SocialSecurityRelation())

  const isLoading = ref(false)

  const close = () => {
    showModal.value = false
    emit('close')
  }

  const destroy = () => {
    if(isLoading) return
    isLoading = true
    Api.delete(`/app/socialSecurityRelation/destroy/${props.socialSecurityRelation.id}`)
      .then(() => {
        emitter.emit('simulationUpdated')
        isLoading = false
      })
  }


</script>
