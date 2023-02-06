<template>
  <div class="w-full flex flex-col space-y-4">

    <AppTitle>Expectativa de vida</AppTitle>

    <div class="w-full flex justify-end">
      <AppButton 
          bg="bg-brand-gradient text-white text-sm px-2 py-1 mr-4 sm:mr-0 mt-2"
          @click="emitter.emit('openLifeExpectationEditModal', {})" 
        >
        <AppIcons icon="edit" />
        <span class="ml-2">Adicionar novo</span>
      </AppButton>
    </div>
    <div class="w-full overflow-x-auto bg-white max-h-[60vh]">
      <table class="w-full table table-auto">
        <thead>
          <tr class="sticky top-0">
            <th>Idade</th>
            <th>Ano de referência</th>
            <th>Exp. homem</th>
            <th>Exp. mulher</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lifeExpectation in lifeExpectations" :key="lifeExpectation">
            <td>{{ lifeExpectation.age }}</td>
            <td>{{ lifeExpectation.yearReference }}</td>
            <td>{{ lifeExpectation.male }}</td>
            <td>{{ lifeExpectation.female }}</td>
            <td>
              <AppButton 
                  bg="bg-brand-gradient text-white text-sm px-2 py-1 mr-4 sm:mr-0 mt-2"
                  @click="emitter.emit('openLifeExpectationEditModal', lifeExpectation)" 
                >
                <AppIcons icon="edit" />
                <span class="ml-2">Editar</span>
              </AppButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminLifeExpectationEditModal @close="getLifeExpectations()"/>
  </div>
</template>
<script setup>

  import AdminLifeExpectationEditModal from './AdminLifeExpectationEditModal.vue'
  const lifeExpectations = ref([])
  const emitter = useEmitter()

  onMounted(() => {
    getLifeExpectations()
  })

  const getLifeExpectations = async () => {
    const query = `
      {
        lifeExpectations (
          order: [
            { column: "age", direction: "asc" },
            { column: "yearReference", direction: "desc" },
          ]
        ) {
          id
          age
          yearReference
          male
          female
        }
      }
    `
    const { data } = await useGraphQL({ query, caller: 'AdminLifeExpectationIndex'})
    lifeExpectations.value = data.lifeExpectations
  }

</script>