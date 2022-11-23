<template>
  <div class="w-full flex flex-wrap p-8 shadow-md bg-cyan-800/5">
    <div class="w-full lg:w-1/3 p-6 flex flex-col justify-start space-y-4">
      <div class="w-full flex mt-4">
        <h3 class="h3 text-left">Processando</h3>
        
      </div>
      <p class="leading-relaxed">Aguarde enquanto processamos o resultado de sua aposentadoria.</p>
      <Transition name="fade">
        <p class="leading-relaxed" v-if="currentPhrase > -1">
          {{ phrases[currentPhrase] }}
        </p>
      </Transition>
      <span class="flex items-center space-x-2 animate-pulse">
        <div class="w-3 h-3 bg-gray-500 rounded-full"></div>
        <div class="w-3 h-3 bg-gray-500 rounded-full"></div>
        <div class="w-3 h-3 bg-gray-500 rounded-full"></div>
      </span>
    </div>
    <div class="w-full lg:w-2/3 flex flex-wrap items-center justify-center">
      <img class="w-full w-1/2 lg:w-3/4" src="/images/general/pack-illustrations/16.svg" />
    </div>

    
  </div>
</template>

<script setup>

  const props = defineProps({
    simulation: Object
  })

  const currentPhrase = ref(0)

  const phrases = ref([
    `O resultado da simulação de sua aposentadoria, cálculos de tempo e projeção são elaborados com base nas suas informações prestadas e registros que conseguimos mapear do seu arquivo CNIS (data de entrada e data de saída dos vínculos).`,
    `Para certificação final dos cálculos e simulações, consulte os nossos analistas previdenciários.`
  ])

  onMounted(() => {
    setInterval(() => {
      if(currentPhrase.value === phrases.value.length -1) {
        changeCurrentPhrase(0)
      } else {
        changeCurrentPhrase(currentPhrase.value + 1)
      }
    }, 5000)
  })


  const changeCurrentPhrase = (current) => {
    currentPhrase.value = -1
    setTimeout(() => {
      currentPhrase.value = current
    }, 200)
  }

</script>
