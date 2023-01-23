<template>
  <div class="w-full overflow-x-auto mt-4 bg-white max-h-[60vh]">
    <table class="w-full table-auto text-sm w-full whitespace-nowrap">
      <thead>
        <tr class="bg-gray-200">
          <th class="sticky top-0 md:left-0 bg-gray-200 border-t-2 z-10">
            <div class="flex justify-between ">
              <span class="border-r max-w-[25vw]">Vínculo</span>
              <div class="flex cursor-pointer" @click="setOrder('monthReference')">
                <span>Mês</span>
                <AppIcons 
                  v-if="orderColumn === 'monthReference'" 
                  :icon="orderColumnDirection === 'asc' ? 'south' : 'north'" 
                  class="text-sky-500"
                  size="16" 
                />
              </div>
            </div>
          </th>
          <th class="sticky top-0 bg-gray-200">
            <div class="flex cursor-pointer" @click="setOrder('baseValue')">
              <span class="">Valor base</span>
              <AppIcons 
                v-if="orderColumn === 'baseValue'" 
                :icon="orderColumnDirection === 'asc' ? 'south' : 'north'" 
                class="text-sky-500"
                size="16" 
              />
            </div>
          </th>
          <th class="sticky top-0 bg-gray-200">
            <div class="flex cursor-pointer" @click="setOrder(valueKeyIndex)">
              <span class="">Índice correção</span>
              <AppIcons 
                v-if="orderColumn === valueKeyIndex" 
                :icon="orderColumnDirection === 'asc' ? 'south' : 'north'" 
                class="text-sky-500"
                size="16" 
              />
            </div>
          </th>
          <th class="sticky top-0 bg-gray-200">
            <div class="flex cursor-pointer" @click="setOrder(valueKey)">
              <span class="">Valor corrigido</span>
              <AppIcons 
                v-if="orderColumn === valueKey" 
                :icon="orderColumnDirection === 'asc' ? 'south' : 'north'" 
                class="text-sky-500"
                size="16" 
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contribution in getOrderedContributions" :key="contribution">
          <td class="border border-zinc-200/50 md:sticky left-0 bg-gray-200 flex justify-between">
            <span class="border-r mr-3 truncate ... max-w-[25vw]">{{ contribution.relationOrigin }}</span>
            <span>{{ contribution.monthReference }}</span>
          </td>
          <td class="border border-zinc-200/50 right-0">{{ vueNumberFormat(contribution.baseValue, getCurrencyFormatter(contribution.monthReference)) }}</td>
          <td class="border border-zinc-200/50 right-0">
            <span v-if="contribution[valueKeyIndex] == 0">--</span>
            <span v-else>{{ contribution[valueKeyIndex] }}</span>
          </td>
          <td class="border border-zinc-200/50 right-0">
            <span v-if="valueKey === 'finalValue' && contribution[valueKeyIndex] == 0">--</span>
            <span v-else>{{ vueNumberFormat(contribution[valueKey]) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>

  import getCurrencyType from '@/util/functions/getCurrencyType'
  import { useSharedSimulationStore } from '@/modules/app/simulation/shared-simulation-store'
  import { storeToRefs } from 'pinia'
  import Dates from '@/services/Dates'
  
  const sharedSimulationStore = useSharedSimulationStore()

  const props = defineProps({
    contributions: {
      type: Array,
      required: true
    }
  })

  const { 
    valueKey,
    valueKeyIndex
  } = storeToRefs(sharedSimulationStore)

  const orderColumn = ref('monetaryCorrectionFinalValue')
  const orderColumnDirection = ref('desc')

  onMounted(() => {
    orderColumn.value = valueKey.value
  })

  const getOrderedContributions = computed(() => {
    return props.contributions.sort((a, b) => {
      if (orderColumnDirection.value === 'asc') {
        if(orderColumn.value == 'monthReference') {
          return Dates.parse(a[orderColumn.value]) - Dates.parse(b[orderColumn.value])
        }
        return a[orderColumn.value] - b[orderColumn.value]
      } else {
        if(orderColumn.value == 'monthReference') {
          return Dates.parse(b[orderColumn.value]) - Dates.parse(a[orderColumn.value])
        }
        return b[orderColumn.value] - a[orderColumn.value]
      }
    })
  })

  const getCurrencyFormatter = (monthReference) => {
    return getCurrencyType(monthReference).vueNumberFormatOptions
  }

  const setOrder = (column) => {
    if(column === orderColumn.value) {
      orderColumnDirection.value = orderColumnDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      orderColumn.value = column
      orderColumnDirection.value = 'asc'
    }
  }

</script>