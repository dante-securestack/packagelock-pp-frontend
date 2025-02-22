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

        <AppMoneyInput
          v-model:value="retirementFactor" 
          icon="calculate"
          :label="getRetirementFactorLabel" 
          placeholder="1" 
          :inputOptions="{ prefix: '', suffix: ' %', decimals: ',', precision: 4 }"
          @change="setRetirementFactor"
          @blur.capture="processCalcules()"
        />

        <AppMoneyInput
          v-model:value="getterRetirementFactor" 
          icon="calculate"
          label="Fator utilizado no cálculo" 
          placeholder="1" 
          :inputOptions="{ prefix: '', suffix: ' %', decimals: ',', precision: 4 }"
          @change="setRetirementFactor"
          @blur.capture="processCalcules()"
          :disabled="true"
        />
        
      </div>

      <AppCollapseItem v-if="simulationRetirementOption.metaData?.retirementFactorDebugInfo">
        <template v-slot:header-left>
          <h3 class="h3 flex-none text-slate-400">Informações sobre {{ getRetirementFactorLabel }}</h3>
        </template>
        <template v-slot:content>
          <div class="w-full grid grid-cols-2 gap-2">
            <AppLabelValue>
            <template v-slot:label>Tempo de contribuição</template>
            <template v-slot:value>{{ simulationRetirementOption.contributionTime.time.timeText }}</template>
          </AppLabelValue>
            <AppLabelValue
              v-for="item in getRetirementFactorDebugInfoKeyValues"
              :key="item.key"
            >
              <template v-slot:label>{{ item.key }}</template>
              <template v-slot:value>{{ item.value }}</template>
            </AppLabelValue>
          </div>
        </template>
      </AppCollapseItem>

      <hr />

      <div class="flex justify-between">
        <AppLabelValue>
          <template v-slot:label>Total contribuições</template>
          <template v-slot:value>{{ contributionsByMonthReference.length }}</template>
        </AppLabelValue>
        <AppLabelValue>
          <template v-slot:label>Soma contribuições incluídas</template>
          <template v-slot:value>{{ vueNumberFormat(includedContributionsTotal) }}</template>
        </AppLabelValue>
        <AppLabelValue>
          <template v-slot:label>Renda mensal inicial na data da aposentadoria</template>
          <template v-slot:value>{{ vueNumberFormat(includedContributionsAvg) }}</template>
        </AppLabelValue>
      </div>

      <div v-if="showOnlyAdmin" class="w-full flex flex-col space-y-4">
        <AppCollapseItem>
          <template v-slot:header-left>
            <h3 class="h3 flex-none text-slate-400">Contribuições incluídas no cálculo</h3>
            <p class="text-xs italic">{{ includedContributions.length }} contribuições</p>
          </template>
          <template v-slot:content>
            <CalculesContributionList :contributionsByMonthReference="includedContributions"/>
          </template>
        </AppCollapseItem>
        
        <AppCollapseItem>
          <template v-slot:header-left>
            <h3 class="h3 flex-none text-slate-400">Contribuições excluídas no cálculo</h3>
            <p class="text-xs italic">{{ excludedContributions.length }} contribuições</p>
          </template>
          <template v-slot:content>
            <CalculesContributionList :contributionsByMonthReference="excludedContributions" />
          </template>
        </AppCollapseItem>
        
        <AppCollapseItem>
          <template v-slot:header-left>
            <h3 class="h3 flex-none text-slate-400">Contribuições fora do período selecionado</h3>
            <p class="text-xs italic">{{ getterFilteredExcludedContributions.length }} contribuições</p>
          </template>
          <template v-slot:content>
            <CalculesContributionList :contributionsByMonthReference="getterFilteredExcludedContributions" />
          </template>
        </AppCollapseItem>

        <AppAlert>
          Utilizando a tabela {{ valueKey }} {{ valueKey == 'monetaryCorrectionFinalValue' ? 'CORREÇÃO MONETÁRIA' : 'ÍNDICE DE CORREÇÃO' }} para correção dos valores das contribuições.
        </AppAlert>
      </div>

      <AppAlert v-else>
        Simulação do cálculo com a regra dos descartes (tempo e contribuição), consulte nossos analistas previdenciários.
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

  const authStore = useAuthStore()

  const { loggedUser } = storeToRefs(authStore)

  const { 
    majorContributionsPercentage,
    majorContributionsQuantity,
    retirementFactor,
    initialDate,
    endDate,
    includedContributions,
    excludedContributions,
    valueKey,
    includedContributionsTotal,
    includedContributionsAvg,
    contributionsByMonthReference,
    getterFilteredExcludedContributions,
    getterRetirementFactor,
  } = storeToRefs(sharedSimulationStore)

  const showModal = ref(false)
  const simulationRetirementOption = ref(new SimulationRetirementOption())

  const getRetirementFactorLabel = computed(() => {
    if([
      'getPreReformByContributionTime',
      'getPreReformByAge',
      'getLifetimeReview',
      'getTransitionToll50Percent',
    ].includes(simulationRetirementOption.value.retirementOption.rule)) {
      return 'Fator previdênciário'
    } else {
      return 'Aliquota de cálculo'
    }
  })

  const getRetirementFactorDebugInfoKeyValues = computed(() => {
    return Object.keys(simulationRetirementOption.value.metaData?.retirementFactorDebugInfo).map((key) => {
      return {
        key,
        value: simulationRetirementOption.value.metaData?.retirementFactorDebugInfo[key]
      }
    })
  })

  onMounted(() => {
    emitter.on('openModalResultContributionList', (payload) => {
      showModal.value = true
      simulationRetirementOption.value = payload.simulationRetirementOption

      if(payload.simulationRetirementOption.retirementOption.rule !== 'getLifetimeReview') {
        setInitialDate('01/07/1994')
      } else {
        setInitialDate(null)
      }
      setEndDate(simulationRetirementOption.value.contextDate)
      setRetirementFactor(simulationRetirementOption.value.retirementFactor)
      const contributionsPercentage = payload.simulationRetirementGroup.retirementGroup.isPreReform ? 80 : 100
      setMajorContributionsPercentage(contributionsPercentage)
      processCalcules()
    })
  })

  onBeforeUnmount(() => {
    emitter.off('openModalResultContributionList')
  })

  const close = () => { showModal.value = false }

  const setMajorContributionsPercentage = (value) => sharedSimulationStore.setMajorContributionsPercentage(value)
  const setMajorContributionsQuantity = (value) => sharedSimulationStore.setMajorContributionsQuantity(value)
  const setRetirementFactor = (value) => sharedSimulationStore.setRetirementFactor(value)
  const setInitialDate = (value) => sharedSimulationStore.setInitialDate(value)
  const setEndDate = (value) => sharedSimulationStore.setEndDate(value)

  const processCalcules = () => sharedSimulationStore.processCalcules()

  const showOnlyAdmin = computed(() => {
    return loggedUser.value && loggedUser.value.role == 'ADMIN'
  })

</script>