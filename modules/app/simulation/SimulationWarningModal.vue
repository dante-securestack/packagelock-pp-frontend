<template>
  <AppBaseModal 
    :show="showModal" 
    @close="close"
    title="Atenção"
  >
    
    <div class="w-full flex flex-col space-y-4">
      <p>O resultado da simulação de sua aposentadoria, cálculos de tempo e projeção são elaborados com base nas suas informações prestadas e registros que conseguimos mapear do seu arquivo CNIS (data de entrada e data de saída dos vínculos).</p>
      <p>Para certificação final dos cálculos e simulações, consulte os nossos analistas previdenciários.</p>

      <div class="w-full flex justify-end mt-12 block">
        <AppButton bg="bg-brand-gradient" text="text-white" @click="close()">
          <span>Ok</span>
        </AppButton>
      </div>
    </div>
  
  </AppBaseModal>
</template>

<script setup>

  import { useGeneralStore } from '@/modules/general/store'
  
  const generalStore = useGeneralStore()
  const route = useRoute()

  const showModal = ref(false)

  setTimeout(() => {
    if(!generalStore.userDimissSimulationModal.includes(route.params.simulationId)) {
      showModal.value = true
    }
  }, 2000)

  const close = () => {
    showModal.value = false
    generalStore.setUserDismissSimulationModal(route.params.simulationId)
  }
</script>

<style>

</style>