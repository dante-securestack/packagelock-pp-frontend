<template>
  <div class="w-full flex flex-wrap space-y-6">

    <div class="w-full flex flex-wrap items-center space-y-4">
      <AppTitle>Tabelas de Correção monetária e Índice de correção</AppTitle>
    </div>

    <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">

      <AppSelectInput
        v-model:value="baseMonth"
        :items="distinctContributionFactorByBaseMonths"
         icon="calendar_month"
        label="Mês de referência"
        placeholder="Selecione um mês"
        @update:value="getItems()"
      >
        Meses cadastrados
      </AppSelectInput>

      <div class="w-full flex flex-col">
        <label class="block mb-2">
          <span class="border-b-4 border-zinc-200 ">Tipo de tabela</span>
        </label>
        <div class="w-full flex space-x-6">
          <AppButton 
            v-for="type in sheetTypes"
            :key="type"
            @click="setType(type)" 
            class="w-full py-3 px-6 border transition-all duration-100" 
            :class="[sheetTypeSelected === type ? 'shadow-lg scale-105 bg-white' : 'border-slate-200 text-gray-300']"
          >
            <span>{{ type.label }}</span>
          </AppButton>
        </div>
      </div>
    </div>

    <div class="w-full flex flex-wrap justify-between">
      <div class="flex space-x-3">
        <AppButton
          v-if="contributionFactors.length"
          class="px-5"
          @click="contributionFactors = []"
        >
          <AppIcons icon="close" />
          <span  class="ml-1">Limpar</span>
        </AppButton>
        <AppButton
          v-else
          class="bg-brand-gradient text-white px-5"
          @click="getItems()"
        >
          <AppIcons icon="search" />
          <span  class="ml-1">Pesquisar</span>
        </AppButton>
      </div>
      <NuxtLink class="self-end" to="/admin/contribution-factors/import">
        <AppButton class="bg-brand-gradient text-white px-5">Ir para importação</AppButton>
      </NuxtLink>
    </div>

    <div class="w-full flex flex-col">

      <AppAlert v-if="isEmpty">Nenhum resultado encontrado</AppAlert>

      <AdminContributionFactorTable
        v-if="contributionFactors.length"
        :contributionFactors="contributionFactors"
        :baseMonth="getBaseMonthForList"
      />

    </div>

  </div>
</template>
<script setup>

  import AdminContributionFactorTable from './AdminContributionFactorTable.vue'
  import Dates from '@/services/Dates'
  import { SHEET_TYPE } from './enum'

  const emitter = useEmitter()
  
  const sheetTypes = ref(SHEET_TYPE)
  const sheetTypeSelected = ref(SHEET_TYPE[0])
  const baseMonth = ref('')
  const contributionFactors = ref([])
  const isEmpty = ref(false)
  const distinctContributionFactorByBaseMonths = ref([])

  onMounted(() => {
    getMonthsAvailable()
  })

  const getBaseMonthForList = computed(() => Dates.format(baseMonth.value, 'MM/yyyy'))

  const getMonthsAvailable = () => {
    const query = `
      { 
        distinctContributionFactorByBaseMonths(type: "${ sheetTypeSelected.value.value }") {
          baseMonth
        }
      }
    `
    useGraphQL({ query, caller: 'AdminContributionFactorIndex.getMonthsAvailable' })
      .then(({ data }) => {
        distinctContributionFactorByBaseMonths.value = data.distinctContributionFactorByBaseMonths.map((i) => {
          return { value: i.baseMonth, label: Dates.format(i.baseMonth, 'MM/yyyy') }
        })

        getItems()
      })

  }

  const getItems = () => {

    contributionFactors.value = []
    setTimeout(() => {
      const query = `
        {
          contributionFactors(
            where: [
              { column: "baseMonth", value: "${ baseMonth.value }" },
              { column: "type", value: "${ sheetTypeSelected.value.value }" }
            ]
          ) {
            id
            baseMonth
            monthReference
            type
            factor
          }
        }
      `
  
      Graphql({ query })
        .then(({ data }) => {
          contributionFactors.value = data.contributionFactors.map((i) => {
            return {
              ...i,
              baseMonth: Dates.format(i.baseMonth, 'yyyy-MM-dd'),
              monthReference: Dates.format(i.monthReference, 'yyyy-MM-dd')
            }
          })
  
          isEmpty.value = !contributionFactors.value.length
        })
    }, 200)
  }

  const setType = (type) => {
    sheetTypeSelected.value = type
    getMonthsAvailable()
  }

</script>