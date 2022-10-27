<template>
  <div class="w-full flex flex-col">
    <AppTitle>Segurados</AppTitle>

    <AppSearchBar placeholder="Procurar por nome, cpf ou telefone" v-model:search="search" @search="get()" />

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
        <AdminClientCard :client="client" />
      </div>

      <AppPaginator v-model:skip="skip" :take="take" :length="clients.length" @change="get()"/>

    </div>
  </div>
</template>

<script setup>

  import GraphQL from '@/util/GraphQL'
  import AdminClientCard from '@/modules/admin/client/AdminClientCard.vue'

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
                { column: "name", operation: "ilike", value: "%${search.value}%" },
                { column: "cpf", operation: "ilike", value: "%${search.value}%" },
                { column: "phone", operation: "ilike", value: "%${search.value}%" },
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
            retirementDate
            isGranted
            firstProjectedRetirementDate
            createdAt
            cnisFile {
              pathUrl
            }
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