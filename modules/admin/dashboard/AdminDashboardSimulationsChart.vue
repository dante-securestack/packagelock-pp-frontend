<template>
  <AppCard>
    <template v-slot:header>
      <h3 class="h3 leading-relaxed">Simulações por mês</h3>
    </template>
    <ChartBar class="p-4 pr-8" :data="data.datasets" :labels="data.labels" :height="200" type="bar-stacked"/>
  </AppCard>
</template>

<script setup>

  import ChartBar from '@/modules/general/ChartBar'
  import Dates from '@/services/Dates'
  import { ArrayHelpers } from '@igortrindade/lazyfy'
  import { colors } from '@/util/functions/chartDefaultOptions'
  
  const Api = useApi()

  const props = defineProps({
    init: String,
    end: String
  })

  const result = ref([])

  const data = computed(() => {

    const labels = []

    const months = result.value.reduce((acc, item) => {
      if(!acc.includes(item.month)) acc.push(item.month)
      return acc
    }, [])

    const statuses = result.value.reduce((acc, item) => {
      if(!acc.includes(item.status)) acc.push(item.status)
      return acc
    }, [])

    const datasets = statuses.map((status, index) => {
      const data = months.map((month) => {
        const finded = ArrayHelpers.find(result.value, { month, status })
        return finded ? finded.count : 0
      })
      return {
        label: status,
        backgroundColor: colors[index],
        data
      }
    })


    return {
      labels: months.map((m) => Dates.getMonthString(m)),
      datasets
    }
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


