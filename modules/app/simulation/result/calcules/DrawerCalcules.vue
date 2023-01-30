<template>
  <AppBaseDrawer @close="close" :showDrawer="showModal" dialogClasses="w-full md:max-w-[80vw]">
    <div class="w-full flex flex-col space-y-6">

      <h3 class="h3 border-l-10 border-orange-500 pl-6 leading-normal mb-4">Cálculos: {{ simulationRetirementOption.retirementOption.title }}</h3>

      <div class="w-full grid lg:grid-cols-2 gap-4">

        <AppMoneyInput
          v-model:value="majorContributionsPercentage" 
          icon="percent"
          label="% maiores contribuições" 
          placeholder="80,00 %" 
          :inputOptions="{ prefix: '', suffix: ' %', decimals: ',', precision: 2 }"
          @change="setMajorContributionsPercentage"
          @blur.capture="processCalcules()"
        />

        <AppMoneyInput
          v-model:value="majorContributionsQuantity" 
          icon="fact_check"
          label="Maiores contribuições" 
          placeholder="180" 
          :inputOptions="{ prefix: '', suffix: '', precision: 0 }"
          @change="setMajorContributionsQuantity"
          @blur.capture="processCalcules()"
        />

        <AppInputWithIcon 
          v-model:value="initialDate" 
          icon="today"
          label="Data inicial do cálculo"
          :mask="['##/##/####']"
          type="tel"
          placeholder="DD/MM/AAAA" 
          @update:value="setInitialDate"
          @blur.capture="processCalcules()"
        />

        <AppInputWithIcon 
          v-model:value="endDate" 
          icon="today"
          label="Data final do cálculo"
          :mask="['##/##/####']"
          type="tel"
          placeholder="DD/MM/AAAA" 
          @update:value="setEndDate"
          @blur.capture="processCalcules()"
        />
      </div>

      <!-- <div class="w-full flex justify-end">
        <AppButton 
          @click="processCalcules()" 
          bg="bg-brand-gradient text-white text-sm px-2 py-1 mr-4 sm:mr-0 flex space-x-3">
          <AppIcons icon="update" />
          <span>Processar</span>
        </AppButton>
      </div> -->

      <hr />

      <div class="flex justify-between">
        <AppLabelValue>
          <template v-slot:label>Total contribuições</template>
          <template v-slot:value>{{ getterMappedContributtions.length }}</template>
        </AppLabelValue>
        <AppLabelValue>
          <template v-slot:label>Soma contribuições incluídas</template>
          <template v-slot:value>{{ vueNumberFormat(includedContributionsTotal) }}</template>
        </AppLabelValue>
        <AppLabelValue>
          <template v-slot:label>Média das contribuições</template>
          <template v-slot:value>{{ vueNumberFormat(includedContributionsAvg) }}</template>
        </AppLabelValue>
      </div>

      

      <AppCollapseItem>
        <template v-slot:header-left>
           <h3 class="h3 flex-none text-slate-400">Contribuições incluídas no cálculo</h3>
          <p class="text-xs italic">{{ includedContributions.length }} contribuições</p>
        </template>
        <template v-slot:content>
          <CalculesContributionList :contributions="includedContributions"/>
        </template>
      </AppCollapseItem>
      
      <AppCollapseItem>
        <template v-slot:header-left>
           <h3 class="h3 flex-none text-slate-400">Contribuições excluídas no cálculo</h3>
          <p class="text-xs italic">{{ excludedContributions.length }} contribuições</p>
        </template>
        <template v-slot:content>
          <CalculesContributionList :contributions="excludedContributions" />
        </template>
      </AppCollapseItem>
      
      <AppCollapseItem>
        <template v-slot:header-left>
           <h3 class="h3 flex-none text-slate-400">Contribuições fora do período selecionado</h3>
          <p class="text-xs italic">{{ getterFilteredExcludedContributions.length }} contribuições</p>
        </template>
        <template v-slot:content>
          <CalculesContributionList :contributions="getterFilteredExcludedContributions" />
        </template>
      </AppCollapseItem>

      <AppAlert>
        Utilizando a tabela {{ valueKey }} {{ valueKey == 'monetaryCorrectionFinalValue' ? 'CORREÇÃO MONETÁRIA' : 'ÍNDICE DE CORREÇÃO' }} para correção dos valores das contribuições.
      </AppAlert>

    </div>
  </AppBaseDrawer>
</template>
<script setup>

  import CalculesContributionList from './CalculesContributionList'
  import emitter from '@/util/emitter'
  import { useSharedSimulationStore } from '@/modules/app/simulation/shared-simulation-store'
  import { storeToRefs } from 'pinia'
  import FormCalcules from '@/forms/FormCalcules'
  import SimulationRetirementOption from '@/entities/SimulationRetirementOption'
  const sharedSimulationStore = useSharedSimulationStore()

  const { 
    majorContributionsPercentage,
    majorContributionsQuantity,
    initialDate,
    endDate,
    includedContributions,
    excludedContributions,
    valueKey,
    includedContributionsTotal,
    includedContributionsAvg,
    getterMappedContributtions,
    getterFilteredExcludedContributions
  } = storeToRefs(sharedSimulationStore)

  const showModal = ref(false)
  const simulationRetirementOption = ref(new SimulationRetirementOption())

  onMounted(() => {
    emitter.on('openModalResultContributionList', (payload) => {
      showModal.value = true
      simulationRetirementOption.value = payload.simulationRetirementOption
      if(payload.simulationRetirementOption.retirementOption.rule !== 'getLifetimeReview') {
        setInitialDate('01/07/1994')
        sharedSimulationStore.setValueKey('finalValue')
        sharedSimulationStore.setValueKeyIndex('contributionFactorValue')
      } else {
        setInitialDate(null)
        sharedSimulationStore.setValueKey('monetaryCorrectionFinalValue')
        sharedSimulationStore.setValueKeyIndex('monetaryCorrectionIndexValue')
      }
      setEndDate(simulationRetirementOption.value.contextDate)
      processCalcules()
    })
  })

  onBeforeUnmount(() => {
    emitter.off('openModalResultContributionList')
  })

  const close = () => { showModal.value = false }

  const setMajorContributionsPercentage = (value) => sharedSimulationStore.setMajorContributionsPercentage(value)
  const setMajorContributionsQuantity = (value) => sharedSimulationStore.setMajorContributionsQuantity(value)
  const setInitialDate = (value) => sharedSimulationStore.setInitialDate(value)
  const setEndDate = (value) => sharedSimulationStore.setEndDate(value)

  const processCalcules = () => sharedSimulationStore.processCalcules()

</script>