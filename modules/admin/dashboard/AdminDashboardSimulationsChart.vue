<template>
  <AppCard>
    <template v-slot:header>
      <h3 class="h3 leading-relaxed">Simulações por mês</h3>
    </template>
    <ChartBar class="p-4 pr-8" :data="data" :height="200"/>
  </AppCard>
</template>

<script setup>

  import ChartBar from '@/modules/general/ChartBar'
  import Dates from '@/services/Dates'
  
  const Api = useApi()

  const props = defineProps({
    init: String,
    end: String
  })

  const result = ref([])

  const data = computed(() => {
    return result.value.map((item) => {
      return {
        x: Dates.getMonthString(item.month),
        y: parseInt(item.count)
      }
    })
  })

  watch(() => [props.init, props.end], (newValue) => {
    getData()
  })

  onMounted(() => {
    getData()
  })

  const getData = () => {
    Api.post(`/admin/dashboard/getData`, { type: 'getSimulationsByMonth', init: props.init, end: props.end })
      .then(({ data }) => {
        result.value = data.getSimulationsByMonth
      })
  }


</script>


