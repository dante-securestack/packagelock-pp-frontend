<template>
  <div class="w-full overflow-x-auto mt-4 bg-white max-h-[60vh]">
    <table class="w-full table-auto text-sm w-full whitespace-nowrap">
      <thead>
        <tr class="bg-gray-200">
          <th class="sticky top-0 left-0 bg-gray-200 z-10">
            <div class="flex cursor-pointer">
              <span class="">Vínculo</span>
            </div>
          </th>
          <th class="sticky top-0 bg-gray-200">
            <div class="flex cursor-pointer" @click="setOrder('monthReference')">
              <span class="">Mês</span>
              <AppIcons 
                v-if="orderColumn === 'monthReference'" 
                :icon="orderColumnDirection === 'asc' ? 'south' : 'north'" 
                class="text-sky-500"
                size="16" 
              />
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
            <div class="flex cursor-pointer" @click="setOrder('limitValue')">
              <span class="">Limite de contribuição</span>
              <AppIcons 
                v-if="orderColumn === 'limitValue'" 
                :icon="orderColumnDirection === 'asc' ? 'south' : 'north'" 
                class="text-sky-500"
                size="16" 
              />
            </div>
          </th>
          <th class="sticky top-0 bg-gray-200">
            <div class="flex cursor-pointer" @click="setOrder('valueAfterCheckLimit')">
              <span class="">Valor após limite</span>
              <AppIcons 
                v-if="orderColumn === 'valueAfterCheckLimit'" 
                :icon="orderColumnDirection === 'asc' ? 'south' : 'north'" 
                class="text-sky-500"
                size="16" 
              />
            </div>
          </th>
          <th class="sticky top-0 bg-gray-200">
            <div class="flex cursor-pointer" @click="setOrder('contributionFactorValue')">
              <span class="">Índice correção</span>
              <AppIcons 
                v-if="orderColumn === 'contributionFactorValue'" 
                :icon="orderColumnDirection === 'asc' ? 'south' : 'north'" 
                class="text-sky-500"
                size="16" 
              />
            </div>
          </th>
          <th class="sticky top-0 bg-gray-200">
            <div class="flex cursor-pointer" @click="setOrder('valueAfterCorrection')">
              <span class="">Valor corrigido</span>
              <AppIcons 
                v-if="orderColumn === 'valueAfterCorrection'" 
                :icon="orderColumnDirection === 'asc' ? 'south' : 'north'" 
                class="text-sky-500"
                size="16" 
              />
            </div>
          </th>
          <th class="sticky top-0 bg-gray-200">
            <div class="flex cursor-pointer" @click="setOrder('finalValue')">
              <span class="">Valor final</span>
              <AppIcons 
                v-if="orderColumn === 'finalValue'" 
                :icon="orderColumnDirection === 'asc' ? 'south' : 'north'" 
                class="text-sky-500"
                size="16" 
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contributionByMonthReference in getOrderedContributionsByMonthReference" :key="contributionByMonthReference">
          <td class="border border-zinc-200/50 border-b-2 border-b-zinc-300 md:sticky left-0 bg-gray-200 ">
            <div class="flex flex-col space-y-1 items-start min-w-[25vw] w-[25vw] max-w-[25vw]">
              <span class="... truncate" v-for="(contribution, index) in contributionByMonthReference.contributions" :key="contribution">{{ index + 1 }} - {{ contribution.relationOrigin }}</span>
            </div>
          </td>
          <td class="border border-zinc-200/50">{{ contributionByMonthReference.monthReference }}</td>
          <td class="border border-zinc-200/50">{{ vueNumberFormat(contributionByMonthReference.baseValue, getCurrencyFormatter(contributionByMonthReference.monthReference)) }}</td>
          <td class="border border-zinc-200/50">{{ vueNumberFormat(contributionByMonthReference.limitValue, getCurrencyFormatter(contributionByMonthReference.monthReference)) }}</td>
          <td class="border border-zinc-200/50">{{ vueNumberFormat(contributionByMonthReference.valueAfterCheckLimit, getCurrencyFormatter(contributionByMonthReference.monthReference)) }}</td>
          <td class="border border-zinc-200/50">{{ contributionByMonthReference.contributionFactorValue }}</td>
          <td class="border border-zinc-200/50">{{ vueNumberFormat(contributionByMonthReference.valueAfterCorrection) }}</td>
          <td class="border border-zinc-200/50">{{ vueNumberFormat(contributionByMonthReference.finalValue) }}</td>
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
    contributionsByMonthReference: {
      type: Array,
      required: true
    }
  })

  const orderColumn = ref('monthReference')
  const orderColumnDirection = ref('asc')

  const getOrderedContributionsByMonthReference = computed(() => {
    return props.contributionsByMonthReference.sort((a, b) => {
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


  const getContributionRelationOrigin = (contributionByMonthReference) => {
    const a = contributionByMonthReference.contributions.map((contribution) => contribution.relationOrigin)
    return [a.slice(0, -1).join(', '), a.slice(-1)[0]].join(a.length < 2 ? '' : ' e ')
  }

</script>