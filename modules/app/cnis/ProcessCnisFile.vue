<template>
  <div class="w-full flex flex-col space-y-8">


    <div class="w-full flex flex-wrap p-8 shadow-md bg-cyan-800/5">

      <div class="w-full lg:w-1/3 flex flex-wrap items-center justify-center">
        <img class="w-full -mt-10 w-1/2 lg:w-3/4" src="/images/general/pack-illustrations/14.svg" />
        <h3 class="h3 text-center">Cálculo e Previdência</h3>
      </div>
      <div class="w-full lg:w-1/3 bg-white p-6 flex flex-col space-y-4 shadow">
        <h3 class="h3">Aposentadoria</h3>
        <p class="leading-relaxed">Verifique de forma simples e rápida se você tem direito a se aposentar e controle seus Registros previdenciários.</p>
      </div>
      <div class="w-full lg:w-1/3 bg-white border-t lg:border-l lg:border-t-0 border-zinc-100 p-6 flex flex-col space-y-4 shadow">
        <h3 class="h3">Programe-se</h3>
        <p class="leading-relaxed">Realize a projeção de quando irá se aposentar e obtenha auxilio dos nossos analistas para definir a melhor estratégia para sua aposentadoria.</p>
      </div>
    </div>
    
    <ProcessCnisFileCard />

    <AppCard>
      <template v-slot:header>
        <div class="w-full flex flex-col pr-12 p-2">
        <h3 class="h3 truncate leading-relaxed ...">Calcular aposentadoria manualmente</h3>
        <h5>Informe os dados do segurado para calcular a sua aposentadoria.</h5>
      </div>
      </template>
      <template v-slot:content>
        <div class="flex flex-col items-start space-y-6 p-2">
          
          <p class="text-lg">
            Não possui o arquivo CNIS fornecido pelo INSS em mãos? Não tem problema! Simule sua aposentadoria informando os dados manualmente.
          </p>
          <AppButton 
            bg="bg-brand-gradient" 
            text="text-white" 
            @click="openClientEditModal()"
          >
            Gerar simulação manualmente
          </AppButton>
        </div>
      </template>
    </AppCard>

    <ClientEditModal />

  </div>

</template>

<script setup>

  import ProcessCnisFileCard from '@/modules/app/cnis/ProcessCnisFileCard.vue'
  import ClientEditModal from '@/modules/app/simulation/ClientEditModal.vue'

  const emitter = useEmitter()
  const route = useRoute()

  const openClientEditModal = () => {
    emitter.emit('openClientEditModal')
  }

</script>

