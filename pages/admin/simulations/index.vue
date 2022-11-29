<template>
  <div class="w-full flex flex-col">
    <AppTitle>Simulações</AppTitle>

    <div class="w-full flex space-x-2 mt-4">
      <AppButton
        class="border border-zinc-200"
        :class="[statusTypesSelected.includes(status) ? 'bg-brand-gradient text-white' : '' ]"
        v-for="status in statusTypes" 
        :key="status"
        @click="toggleStatus(status)"
      >
        {{ status }}
      </AppButton>
    </div>

    <div class="w-full flex flex-col space-y-6 mt-6">

      <AppLoaderPlaceholder :quantity="3" v-if="!simulations" />

      <AppAlert v-else-if="!simulations.length">Nenhuma simulação encontrada</AppAlert>

      <div 
        v-else
        class="w-full flex flex-col bg-white shadow-sm p-4 hover:shadow-lg space-y-4 relative"
        v-for="(simulation, index) in simulations"
        :key="`admin-simulation-${index}`"
      >

        <div class="absolute top-0 right-0 mt-2 mr-2 flex justify-end">
          <AppButton 
            @click="openSimulationEditModal(simulation)" 
            class="text-zinc-400 hover:text-orange-600">
            <AppIcons icon="edit" />
          </AppButton>
        </div>

        <div class="w-full flex flex-wrap">
          <AppLabelValue class="four-cols-breakdown">
            <template v-slot:label>Gerada em:</template>
            <template v-slot:value>{{ simulation.createdAt }}</template>
          </AppLabelValue>
          <AppLabelValue class="four-cols-breakdown">
            <template v-slot:label>Data do cálculo</template>
            <template v-slot:value>{{ simulation.retirementDate }}</template>
          </AppLabelValue>
          <AppLabelValue class="four-cols-breakdown">
            <template v-slot:label>Primeira aposentadoria</template>
            <template v-slot:value>{{ simulation.firstProjectedRetirementDate || '--'}}</template>
          </AppLabelValue>
          <AppLabelValue class="four-cols-breakdown">
            <template v-slot:label>Status</template>
            <template v-slot:value>{{ simulation.status }}</template>
          </AppLabelValue>
        </div>
        <AppLabelValue>
          <template v-slot:label>Segurado</template>
          <template v-slot:value>{{ simulation.client.name }}</template>
        </AppLabelValue>
        <AppLabelValue>
          <template v-slot:label>Usuário</template>
          <template v-slot:value>
            <span v-if="!simulation.user">--</span>
            <span v-else>{{ simulation.user.name }}</span>
          </template>
        </AppLabelValue>

        <div class="w-full flex space-x-4">
          <LabelIsGranted class="" :isGranted="simulation.isGranted" />
          <NuxtLink :to="`/simulacao/${simulation.id}`" class="w-auto">
            <AppButton class="bg-brand-gradient text-white px-5">
              <AppIcons icon="zoom_in" />
              <span  class="ml-1">Ver online</span>
            </AppButton>
          </NuxtLink>
          <a v-if="simulation.cnisFile" :href="simulation.cnisFile.pathUrl" target="_blank">
            <AppButton class="bg-brand-gradient text-white px-5">
              <AppIcons icon="picture_as_pdf" />
              <span class="ml-1">Download arquivo cnis</span>
            </AppButton>
          </a>
        </div>
      </div>
    </div>

    <AppPaginator v-model:skip="skip" :take="take" :length="simulations.length" @change="get()"/>

    <SimulationEditModal @close="get" />

  </div>
</template>

<script setup>
  import GraphQL from '@/util/GraphQL'
  import LabelIsGranted from '@/modules/app/simulation/result/LabelIsGranted.vue'
  import SimulationEditModal from '@/modules/admin/simulation/SimulationEditModal.vue'
  import { ArrayHelpers } from '@igortrindade/lazyfy'

  const emitter = useEmitter()
  const route = useRoute()

  const search = ref('')
  const skip = ref(0)
  const take = ref(12)
  const simulations = ref(false)
  const showDropdown = ref(false)
  const statusTypes = ref(['PENDENTE', 'CRIADA POR ADMIN', 'CRIADA POR USUÁRIO', 'ENTRAR EM CONTATO'])
  const statusTypesSelected = ref(['PENDENTE', 'CRIADA POR ADMIN', 'CRIADA POR USUÁRIO', 'ENTRAR EM CONTATO'])

  onMounted(() => {
    get()
  })

  const get = () => {
    let whereClause = ``
    if(route.query.clientId) whereClause += `{ column: "clientId", value: "${route.query.clientId}"}`
    if(route.query.userId) whereClause += `{ column: "userId", value: "${route.query.userId}"}`

    const statusToSearch = `[ ${statusTypesSelected.value.map((s) => `\\"${s}\\"`).join(',')}]`
    
    whereClause += `
      where: [
        ${ whereClause }
        { column: "status", operation: "in", value: "${statusToSearch}" }
      ],
    `
    
    const query = `
      {
        simulations (
          ${ whereClause }
          order: [
            { column: "createdAt", direction: "DESC" }
          ]
          take: ${take.value}
          skip: ${skip.value}
        ) {
          key
          id
          userId
          title
          retirementDate  
          createdAt
          clientId
          status
          isGranted
          firstProjectedRetirementDate
          client {
            id
            name
          }
          user {
            id
            name
          }
          cnisFile {
            id
            pathUrl
          }
        }
      }
    `
    
    
    GraphQL({ query, caller: 'AdminSimulationsIndex' })
      .then(({ data }) => {
        simulations.value = data.simulations
        if(!data.simulations.length) skip.value = 0
      })

  }

  const openSimulationEditModal = (simulation) => {
    emitter.emit('openSimulationEditModal', { simulation })
  }

  const toggleStatus = (status) => {
    ArrayHelpers.toggleInArray(statusTypesSelected.value, status)
    get()
  }

  
</script>