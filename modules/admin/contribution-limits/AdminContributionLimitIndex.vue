<template>
  <div class="w-full flex flex-col">

    <div class="w-full flex justify-end">
      <AppButton 
          bg="bg-brand-gradient text-white text-sm px-2 py-1 mr-4 sm:mr-0 mt-2"
          @click="emitter.emit('openContributionLimitEditModal', {})" 
        >
        <AppIcons icon="edit" />
        <span class="ml-2">Adicionar novo</span>
      </AppButton>
    </div>
    <div class="w-full overflow-x-auto">
      <table class="w-full table table-auto">
        <thead>
          <tr>
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