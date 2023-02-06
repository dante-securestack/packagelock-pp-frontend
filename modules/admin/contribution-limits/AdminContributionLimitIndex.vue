<template>
  <div class="w-full flex flex-col space-y-4">

    <AppTitle>Limites de contribuição</AppTitle>

    <div class="w-full flex justify-end">
      <AppButton 
          bg="bg-brand-gradient text-white text-sm px-2 py-1 mr-4 sm:mr-0 mt-2"
          @click="emitter.emit('openContributionLimitEditModal', {})" 
        >
        <AppIcons icon="edit" />
        <span class="ml-2">Adicionar novo</span>
      </AppButton>
    </div>
    <div class="w-full overflow-x-auto bg-white max-h-[60vh]">
      <table class="w-full table table-auto">
        <thead>
          <tr class="sticky top-0">
            <th>Mês</th>
            <th>Teto contribuição</th>
            <th>Mínimo</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contributionLimit in contributionLimits" :key="contributionLimit">
            <td>{{ contributionLimit.monthReference }}</td>
            <td>{{ vueNumberFormat(contributionLimit.contributionLimit) }}</td>
            <td>{{ vueNumberFormat(contributionLimit.contributionMinimum) }}</td>
            <td>
              <AppButton 
                  bg="bg-brand-gradient text-white text-sm px-2 py-1 mr-4 sm:mr-0 mt-2"
                  @click="emitter.emit('openContributionLimitEditModal', contributionLimit)" 
                >
                <AppIcons icon="edit" />
                <span class="ml-2">Editar</span>
              </AppButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminContributionLimitEditModal @close="getContributionLimits()"/>
  </div>
</template>
<script setup>

  import AdminContributionLimitEditModal from './AdminContributionLimitEditModal.vue'
  const contributionLimits = ref([])
  const emitter = useEmitter()

  onMounted(() => {
    getContributionLimits()
  })

  const getContributionLimits = async () => {
    const query = `
      {
        contributionLimits (
          order: [
            { column: "monthReference", direction: "desc" }
          ]
        ) {
          id
          monthReference
          contributionLimit
          contributionMinimum
        }
      }
    `
    const { data } = await useGraphQL({ query, caller: 'AdminContributionLimitIndex'})
    contributionLimits.value = data.contributionLimits
  }

</script>

<style scoped>

  table tr:first-child {
    position: -webkit-sticky;
    position: sticky;
    left: 0;
    z-index: 2;
  }
  thead th:first-child,
  tfoot th:first-child {
    z-index: 5;
  }

</style>