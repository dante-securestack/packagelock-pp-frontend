<template>
  <div class="overflow-x-auto mt-4 bg-white max-h-[50vh]">

    <table class="table-auto w-full whitespace-nowrap border relative">
      <thead>
        <tr class="bg-gray-200">
          <th class="sticky top-0 bg-gray-200 border-t-2 z-10">Ano</th>
          <th
            class="sticky top-0 bg-gray-200"
            v-for="month in months"
            :key="month"
          >
            {{ month.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="year in years"
          :key="year"
        >
          <td class="border border-zinc-200/50 sticky left-0 bg-gray-200">{{ year }}</td>
          <td
            class="border border-zinc-200/50"
            v-for="month in months"
            :key="month"
          >
            {{ getMonthValue(month.name, year) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>

  import getMonths from '@/util/functions/getMonths'
  import { ArrayHelpers } from '@igortrindade/lazyfy'
  import Dates from '@/services/Dates'

  const props = defineProps({
    contributionFactors: {
      type: Array,
      required: true
    },
    baseMonth: {
      type: String,
      required: true
    }
  })

  const years = computed(() => {
    return props.contributionFactors.reduce((acc, contributionFactor) => {
      const year = Dates.format(contributionFactor.monthReference, 'yyyy')
      if(acc.indexOf(year) === -1) {
        acc.push(year)
      }
      return acc
    }, [])
  })

  const months = computed(() => {
    return getMonths()
  })

  const getBaseMonth = computed(() => {
    return Dates.format(props.baseMonth, 'yyyy-MM-dd')
  })

  const getMonthValue = (monthNumber, year) => {
    const monthReference = `${year}-${Dates.getMonthNumber(monthNumber)}-01`
    const finded = ArrayHelpers.find(props.contributionFactors, { baseMonth: getBaseMonth.value, monthReference })
    return finded?.factor || 0
  }


</script>

<style scoped>

  th:first-child {
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