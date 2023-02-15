<template>
  <AppCard 
    v-if="showRetirementGroup(simulationRetirementGroup)"
    :border="'w-4 bg-zinc-100'"
  >
    <template v-slot:header>
      <div class="w-full flex flex-col">
        <h3 class="h3 leading-relaxed ...">
          <span class="mr-2">{{ simulationRetirementGroup.retirementGroup.title }}</span>
          <AppIcons 
            @click="emitter.emit('openContentDrawer', { table: 'retirementGroups', id: simulationRetirementGroup.retirementGroup.id })" 
            icon="info" 
            color="text-sky-700"
            class="cursor-pointer ml-1"
          />
        </h3>
        <div class="p text-slate-400 leading-relaxed" v-html="simulationRetirementGroup.retirementGroup.content"></div>
      </div>
    </template>
    <template v-slot:content>

        <ResultRetirementOptionCard
          v-for="(simulationRetirementOption, index) in simulationRetirementGroup.simulationRetirementOptions" 
          :simulationRetirementOption="simulationRetirementOption"
          :simulationRetirementGroup="simulationRetirementGroup"
          :key="`simulationRetirementOption${index}`"
        />

      <p class="text-lg italic" v-if="isGranted">
        Pelos elementos apresentados, você tem direito à aposentadoria pela regra <b>{{ simulationRetirementGroup.retirementGroup.title }}</b>.
        Fale com o analista previdenciário para orientação sobre requerimento ou planejamento para avaliar a melhor estratégia para sua aposentadoria.
        <button class="font-bold text-blue-600 italic" @click="emitter.emit('openContactModal')">Fale com o analista!</button>
      </p>
      <p class="text-lg italic" v-else>
        Pelos elementos apresentados, você ainda não tem direito à aposentadoria pela regra <b>{{ simulationRetirementGroup.retirementGroup.title }}</b>.
        Fale com o analista previdenciário para verificar a inclusão de novos tempos, revisão de valores e avaliar a melhor estratégia para sua aposentadoria.
        <button class="font-bold text-blue-600 italic" @click="emitter.emit('openContactModal')">Fale com o analista!</button>
      </p>
    </template>
  </AppCard>
</template>

<script setup>
  
  import ResultRetirementOptionCard from '@/modules/app/simulation/result/ResultRetirementOptionCard'
  import Dates from '@/services/Dates'
  const emitter = useEmitter()
  const props = defineProps({
    simulationRetirementGroup: Object,
    simulation: Object,
  })

  const isGranted = computed(() => {
    return props.simulationRetirementGroup.simulationRetirementOptions.filter((i) => i.isGranted).length > 0
  })

  const showRetirementGroup = (simulationRetirementGroup) => {
    const isPreReform = simulationRetirementGroup.retirementGroup.isPreReform
    const retirementDateIsPreReform = Boolean(Dates.parse(props.simulation.retirementDate) < Dates.parse('2019-11-13'))

    const hasItemsToShow = Boolean(simulationRetirementGroup.simulationRetirementOptions.length)
    if(isPreReform) {
      return Boolean(hasItemsToShow)
    }

    return Boolean(!retirementDateIsPreReform && hasItemsToShow)
  }

</script>