<template>
  <div class="w-full flex flex-col space-y-8">
    <AppLoaderPlaceholder v-if="!simulation" />

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

        <div class="w-full flex border-b border-zinc-100 bg-white">
          <div 
            v-for="(tab, index) in tabsAvailable"
            :key="`simulation-tabs-${index}`"
            class="px-10 pt-4 pb-2 border-b-8 cursor-pointer relative"
            :class="[tab == tabSelected ? 'border-orange-400 hover:border-orange-500' : 'border-transparent hover:border-zinc-100']"
            @click="setTabSelected(tab)"
          >
            <h5 class="h5 mb-0">{{ tab.label }}</h5>
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
  import { ArrayHelpers } from '@igortrindade/lazyfy'
  import { SIMULATION_RESULT_TAB, SIMULATION_RELATION_TAB } from './enums'
  const route = useRoute()
  const router = useRouter()
  const appSimulationStore = useAppSimulationStore()

  const simulation = ref(false)

  const tabsAvailable = computed(() => {
    if(simulation.value && !simulation.value.socialSecurityRelations.length) return [SIMULATION_RELATION_TAB]
    return [SIMULATION_RESULT_TAB, SIMULATION_RELATION_TAB]
  })

  const tabSelected = computed(() => {
    if(route.query.tab) return ArrayHelpers.find(tabsAvailable.value, { value: route.query.tab })
    if(simulation.value && !simulation.value.socialSecurityRelations.length) return ArrayHelpers.find(tabsAvailable.value, { value: SIMULATION_RELATION_TAB.value })
    return ArrayHelpers.find(tabsAvailable.value, { value: SIMULATION_RESULT_TAB.value })
  })

  onMounted(() => {
    getSimulation(true)
    emitter.on('simulationUpdated', getSimulation)
    emitter.on('simulationIsPending', () => {
      simulation.value.isPendingUpdate = true
    })
    appSimulationStore.setSimulationId(route.params.simulationId)
  })

  onBeforeUnmount(() => {
    emitter.off('simulationUpdated', getSimulation)
    emitter.off('simulationIsPending')
  })

  const getSimulation = () => {
    const query = `

      {

        simulation ( 
          where: [
            { column: "id", value: "${route.params.simulationId}" }
          ]
        ) {
          id
          retirementDate
          isPendingUpdate
          client {
            id
            name
            motherName
            email
            phone
            cpf
            nit
            gender
            birthDate
          }
          simulationRetirementGroups  {
            id
            retirementGroup {
              id
              title
              description
              order
              isPreReform
            }
            simulationRetirementOptions {
              id
              isGranted
              contextDate
              age
              contributionTime
              contributionsTotal
              requirements
              projectedRetirementDate
              retirementOption {
                id
                title
                description
                order
                showForNotLoggedUsers
              }
            }
          }
          socialSecurityRelations {
            id
          }
        }
      }
    
    `

    GraphQL({ query }).then(({ data }) => {
      simulation.value = new Simulation(data.simulation)
      orderSimulationItems()
    })
  }
  

  if(process.client) {
    const socket = inject('socket')
    if(!socket.connected) {
      socket.on("connect", () => {
        socket.emit('addSimulationListener', route.params.simulationId)
        socket.on('simulationProcessed', (payload) => {
          getSimulation()
        })
      })
    } else {
      console.log('Inicializando socket no component simulações')
      socket.emit('addSimulationListener', route.params.simulationId)
      socket.on('simulationProcessed', (payload) => {
        getSimulation()
      })
    }
  }

  const setTabSelected = (tab) => {
    router.replace({ ...route, query: { tab: tab.value } })
  }

  const orderSimulationItems = () => {

    simulation.value.simulationRetirementGroups.sort((a, b) => {
      return a.retirementGroup.order - b.retirementGroup.order
    })

    simulation.value.simulationRetirementGroups.forEach((simulationRetirementGroup) => {
      simulationRetirementGroup.simulationRetirementOptions.sort((a, b) => {
        return a.retirementOption.order - b.retirementOption.order
      })
    })

    simulation.value.simulationRetirementGroups = simulation.value.simulationRetirementGroups.sort((a, b) => {
      return a.retirementGroup.order - b.retirementGroup.order
    })

  }

</script>
