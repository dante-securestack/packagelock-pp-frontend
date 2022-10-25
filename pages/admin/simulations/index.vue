<template>
  <div class="w-full flex flex-col">
    <AppTitle>Simulações</AppTitle>

    <AppSearchBar placeholder="Procurar por nome da simulação" v-model:search="search" @search="get()" />

    <div class="w-full flex flex-col space-y-6 mt-6">

      <AppLoaderPlaceholder :quantity="3" v-if="!simulations" />

      <AppAlert v-else-if="!simulations.length">Nenhuma simulação encontrada</AppAlert>

      <div 
        v-else
        class="w-full flex flex-col bg-white shadow-sm p-4 hover:shadow-lg"
        v-for="(simulation, index) in simulations"
        :key="`admin-simulation-${index}`"
      >

        <div class="w-full flex flex-wrap">
          <AppLabelValue class="four-cols-breakdown">
            <template v-slot:label>Data</template>
            <template v-slot:value>{{ simulation.createdAt }}</template>
          </AppLabelValue>
          <AppLabelValue class="four-cols-breakdown">
            <template v-slot:label>Segurado</template>
            <template v-slot:value>{{ simulation.client.name }}</template>
          </AppLabelValue>
          <AppLabelValue class="four-cols-breakdown">
            <template v-slot:label>Usuário</template>
            <template v-slot:value>
              <span v-if="!simulation.user">--</span>
              <span v-else>{{ simulation.user.name }}</span>
            </template>
          </AppLabelValue>
          <AppLabelValue class="four-cols-breakdown">
            <template v-slot:label>Data do cálculo</template>
            <template v-slot:value>{{ simulation.retirementDate }}</template>
          </AppLabelValue>
        </div>

        <div class="w-full flex space-x-4 mt-4">
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

  </div>
</template>

<script setup>
  import GraphQL from '@/util/GraphQL'

  const router = useRouter()
  const route = useRoute()

  const search = ref('')
  const skip = ref(0)
  const take = ref(12)
  const simulations = ref(false)

  onMounted(() => {
    get()
  })

  const get = () => {
    let whereClause
    if(route.query.clientId) whereClause = `{ column: "clientId", value: "${route.query.clientId}"}`
    if(route.query.userId) whereClause = `{ column: "userId", value: "${route.query.userId}"}`
    
    const where = !whereClause ? '' : `
      where: [
        ${ whereClause }
        ${
          !search.value ? '' :  `
            { column: "title", operation: "ilike", value: "%${search.value}%" }
          `
        }
      ],
    `
    
    const query = `
      {
        simulations (
          ${ where }
          order: [
            { column: "createdAt", direction: "DESC" }
          ]
          take: ${take.value}
          skip: ${skip.value}
        ) {
          key
          id
          title
          retirementDate  
          createdAt
          clientId
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

  
</script>