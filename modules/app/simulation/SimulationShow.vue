<template>
  <div class="w-full flex flex-col space-y-8">

    <!-- <pre>{{ simulation }}</pre> -->

    <AppLoaderPlaceholder v-if="!simulationIsReady" />

    <div v-else class="w-full flex flex-col space-y-8">

      <SimulationClientCard 
        :client="simulation.client"
        :simulation="simulation"
      ></SimulationClientCard>

      <div 
        class="
          w-full
          flex
          flex-col
          sm:shadow
          sm:hover:shadow-lg
          transition-shadow
          ease-in-out
          duration-300
          sm:bg-white
          sm:border
          sm:border-slate-100
        "
        :class="[tabSelected.value === 'social-security-relations' ? 'bg-white' : '']"
        >

        <div class="w-full overflow-x-auto hide-scrollbar flex border-b border-zinc-100 bg-white">
          <div 
            v-for="(tab, index) in tabsAvailable"
            :key="`simulation-tabs-${index}`"
            class="px-4 md:px-10 pt-4 pb-2 border-b-8 cursor-pointer relative"
            :class="[tab == tabSelected ? 'border-orange-400 hover:border-orange-500' : 'border-transparent hover:border-zinc-100']"
            @click="setTabSelected(tab)"
          >
            <h5 class="h5 mb-0 whitespace-nowrap">{{ tab.label }}</h5>
            <span class="w-3 h-3 bg-orange-600 absolute top-0 right-0 mt-2 mr-2 rounded-full" v-if="tab.value == 'result' && simulation.isPendingUpdate"></span>
          </div>
          
        </div>

        <transition name="slide-left" mode="out-in" appear>
          <ResultTab 
            v-if="tabSelected.value === 'result'"
            :simulation="simulation"
          ></ResultTab>
          <RelationTab 
            v-else-if="tabSelected.value === 'social-security-relations'"
            :simulation="simulation"
          ></RelationTab>
        </transition>
      </div>
    </div>

    <ClientEditModal :simulation="simulation || null"/>
    <SimulationWarningModal/>
  </div>
</template>

<script setup>
  import Api from '@/util/Api'
  import Simulation from '@/entities/Simulation'
  import ResultTab from'@/modules/app/simulation/result/ResultTab'
  import SimulationClientCard from'@/modules/app/simulation/SimulationClientCard'
  import RelationTab from'@/modules/app/simulation/relation/RelationTab'
  import ClientEditModal from '@/modules/app/simulation/ClientEditModal.vue'
  import SimulationWarningModal from '@/modules/app/simulation/SimulationWarningModal.vue'
  import emitter from '@/util/emitter'
  import GraphQL from "@/util/GraphQL"
  import { useAppSimulationStore } from '@/modules/app/simulation/store'
  import { useSharedSimulationStore } from '@/modules/app/simulation/shared-simulation-store'
  import { ArrayHelpers } from '@igortrindade/lazyfy'
  import { SIMULATION_RESULT_TAB, SIMULATION_RELATION_TAB } from './enums'
  import { storeToRefs } from 'pinia'
  const route = useRoute()
  const router = useRouter()
  const appSimulationStore = useAppSimulationStore()
  const sharedSimulationStore = useSharedSimulationStore()

  const { simulation, simulationIsReady } = storeToRefs(sharedSimulationStore)

  const tabsAvailable = computed(() => {
    if(simulation.value && simulation.value.isPendingUpdate && !simulation.value.socialSecurityRelations.length) return [SIMULATION_RESULT_TAB]
    if(simulation.value && !simulation.value.socialSecurityRelations.length) return [SIMULATION_RELATION_TAB]
    return [SIMULATION_RESULT_TAB, SIMULATION_RELATION_TAB]
  })

  const tabSelected = computed(() => {
    if(route.query.tab) return ArrayHelpers.find(tabsAvailable.value, { value: route.query.tab })
    if(simulation.value && simulation.value.isPendingUpdate && !simulation.value.socialSecurityRelations.length) return ArrayHelpers.find(tabsAvailable.value, { value: SIMULATION_RESULT_TAB.value })
    if(simulation.value && !simulation.value.socialSecurityRelations.length) return ArrayHelpers.find(tabsAvailable.value, { value: SIMULATION_RELATION_TAB.value })
    return ArrayHelpers.find(tabsAvailable.value, { value: SIMULATION_RESULT_TAB.value })
  })

  onMounted(() => {
    appSimulationStore.setSimulationId(route.params.simulationId)
    getSimulation()
    emitter.on('simulationUpdated', getSimulation)
    emitter.on('simulationIsPending', () => {
      simulation.value.isPendingUpdate = true
    })
  })

  onBeforeUnmount(() => {
    emitter.off('simulationUpdated', getSimulation)
    emitter.off('simulationIsPending')
  })

  const getSimulation = () => {
    sharedSimulationStore.getSimulation(route.params.simulationId)
  }

  if(process.client) {
    const socket = inject('socket')
    if(!socket.connected) {
      socket.on("connect", () => {
        socket.emit('addSimulationListener', route.params.simulationId)
        socket.on('simulationProcessed', (payload) => {
          getSimulation()
          emitter.emit('addToast', { message: 'Simulação processada com sucesso', type: 'success' })
        })
      })
    } else {
      console.log('Inicializando socket no component simulações')
      socket.emit('addSimulationListener', route.params.simulationId)
      socket.on('simulationProcessed', (payload) => {
        getSimulation()
        emitter.emit('addToast', { message: 'Simulação processada com sucesso', type: 'success' })
      })
    }
  }

  const setTabSelected = (tab) => {
    router.replace({ ...route, query: { tab: tab.value } })
  }

</script>
