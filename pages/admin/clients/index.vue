<template>
  <div class="w-full flex flex-col">
    <AppTitle>Segurados</AppTitle>

    <AppSearchBar placeholder="Procurar" v-model:search="search" @search="get()" />

    <div class="w-full flex flex-col space-y-6 mt-6">

      <AppLoaderPlaceholder v-if="!clients" />

      <AppAlert v-else-if="!clients.length">
        Nenhum segurado encontrado
      </AppAlert>

      <div
        v-else 
          class="w-full flex flex-col bg-white shadow-sm p-4 hover:shadow-lg"
          v-for="(client, index) in clients"
          :key="`admin-client-${index}`"
        >

          <div class="w-full flex flex-wrap space-y-2">
            <AppLabelValue class="four-cols-breakdown">
              <template v-slot:label>Cadastrado em</template>
              <template v-slot:value>{{ client.createdAt }}</template>
            </AppLabelValue>
            <AppLabelValue class="four-cols-breakdown">
              <template v-slot:label>Usuário</template>
              <template v-slot:value>{{ client.name }}</template>
            </AppLabelValue>
            <AppLabelValue class="four-cols-breakdown">
              <template v-slot:label>Email</template>
              <template v-slot:value>{{ client.email }}</template>
            </AppLabelValue>
            <AppLabelValue class="four-cols-breakdown">
              <template v-slot:label>Telefone</template>
              <template v-slot:value>{{ client.phone }}</template>
            </AppLabelValue>
            <AppLabelValue class="four-cols-breakdown">
              <template v-slot:label>CPF</template>
              <template v-slot:value>{{ client.cpf }}</template>
            </AppLabelValue>
          </div>

          <div class="w-full flex space-x-4 mt-4">
            <NuxtLink :to="`/admin/simulations?clientId=${client.id}`" class="w-auto">
              <AppButton class="bg-brand-gradient text-white px-5">
                <AppIcons icon="zoom_in" />
                <span  class="ml-1">Ver simulações</span>
              </AppButton>
            </NuxtLink>
          </div>
        </div>

        <AppPaginator v-model:skip="skip" :take="take" :length="clients.length" @change="get()"/>

    </div>
  </div>
</template>

<script setup>
  import GraphQL from '@/util/GraphQL'
  
  const search = ref('')
  const skip = ref(0)
  const take = ref(12)
  const clients = ref(false)

  onMounted(() => {
    get()
  })


  const get = () => {
    const query = `
      {
        clients (
          skip: ${skip.value}
          take: ${take.value}
          order: [
            { column: "name", direction: "ASC" }
          ]
          ${
            !search.value ? '' :  `
              where: [
                { column: "name", operation: "ilike", value: "%${search.value}%" }
              ]
            `
          }
        ) {
          key
          id
          name
          email
          phone
          cpf
          nit
          gender
          createdAt
          simulations {
            id
            title
          }
        }
      }
    `
    
    
    GraphQL({ query })
      .then(({ data }) => {
        clients.value = data.clients
      })

  }


  
</script>