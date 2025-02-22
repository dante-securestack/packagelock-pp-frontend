<template>

  <div class="w-full flex flex-col items-start space-y-4 shadow hover:shadow-md border border-zinc-100 mb-6 p-4 relative bg-zinc-100/20">

    <h3 class="h4 leading-relaxed">
      <span class="mr-2">{{ simulationRetirementOption.retirementOption.title }}</span>
      <AppIcons 
        @click="emitter.emit('openContentDrawer', { table: 'retirementOptions', id: simulationRetirementOption.retirementOption.id })" 
        icon="info" 
        color="text-sky-700"
        class="cursor-pointer"
      />
    </h3>

    <div class="p text-slate-400 leading-relaxed" v-html="simulationRetirementOption.retirementOption.content"></div>

    <div class="w-full flex flex-col space-y-4" v-if="simulationRetirementOption.age || simulationRetirementOption.contributionTime">
      <AppLabelValue>
        <template v-slot:label>Data base</template>
        <template v-slot:value>{{ simulationRetirementOption.contextDate }}</template>
      </AppLabelValue>
      <AppLabelValue>
        <template v-slot:label>Idade</template>
        <template v-slot:value>{{ simulationRetirementOption.age.time.timeText }}</template>
      </AppLabelValue>
      <AppLabelValue>
        <template v-slot:label>Tempo de contribuição</template>
        <template v-slot:value>{{ simulationRetirementOption.contributionTime.time.timeText }}</template>
      </AppLabelValue>
      <AppLabelValue>
        <template v-slot:label>Quantidade de contribuições</template>
        <template v-slot:value>{{ simulationRetirementOption.contributionsTotal }}</template>
      </AppLabelValue>
    </div>

    <template v-if="(loggedUser || simulationRetirementOption.retirementOption.showForNotLoggedUsers)">

      <div class="w-full flex flex-col" v-if="simulationRetirementOption.retirementOption.rule !== 'getLifetimeReview' && showDetail">
        <p class="p text-slate-400 leading-none mb-2">
          Projeção de aposentadoria
        </p>
        <!-- <AppIcons :icon="simulationRetirementOption.isGranted ? 'check' : 'warning'" :class="[!simulationRetirementOption.isGranted ? 'text-red-400' : 'text-green-600']" /> -->
        <p class="text-slate-600 leading-relaxed">
          <span>Em havendo continuidade das contribuições, a aposentadoria nesta modalidade será cumprida em </span>
          <b>{{ getProjectedRetirementDate }}</b>.
        </p>
      </div>
      
      <LabelIsGranted :isGranted="simulationRetirementOption.isGranted" />

      <div class="w-full">
        <AppButton 
            bg="bg-brand-gradient text-white text-sm px-2 py-1 mr-4 sm:mr-0 mt-2"
            @click="emitter.emit('openModalResultContributionList', { simulationRetirementOption, simulationRetirementGroup })" 
          >
          <AppIcons icon="calculate" />
          <span class="ml-2">Ver cálculos</span>
        </AppButton>
      </div>

    </template>

    <template v-else>
      <div class="w-full p-8 bg-cyan-800/5 p-8 shadow-md bg-cyan-800/5 flex flex-wrap">
        <p class="p">
          <span 
            @click="emitter.emit('openAuthModal')"
            class="font-bold italic text-blue-500 cursor-pointer"
          >
            Clique aqui e cadastre-se gratuitamente
          </span> 
          para ver o resultado de sua aposentadoria na 
          <b>{{ simulationRetirementOption.retirementOption.title }}</b>.
        </p>
      </div>
    </template>
    
  </div>
</template>

<script setup>

  import LabelIsGranted from '@/modules/app/simulation/result/LabelIsGranted'
  import Dates from '@/services/Dates'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from "@/modules/auth/store"
  const emitter = useEmitter()
  const authStore = useAuthStore()

  const { loggedUser } = storeToRefs(authStore)

  const props = defineProps({
    simulationRetirementOption: Object,
    simulationRetirementGroup: Object,
  })

  const getProjectedRetirementDate = computed(() => {
    if(!props.simulationRetirementOption.projectedRetirementDate) return false
    return Dates.format(props.simulationRetirementOption.projectedRetirementDate, 'dd/MM/yyyy')
  })

  const getProjectedRetirementDateIsAfterToday = computed(() => {
    if(!props.simulationRetirementOption.projectedRetirementDate) return false
    if(Dates.parse(props.simulationRetirementOption.projectedRetirementDate) <= new Date()) return false
    return true
  })

  const forceShowDetail = computed(() => {
    return loggedUser.value && ['igortrindademe@gmail.com', 'brunofa23@gmail.com'].includes(loggedUser.value.email)
  })

  const showOnlyAdmin = computed(() => {
    return loggedUser.value && loggedUser.value.role == 'ADMIN'
  })

  const showDetail = computed(() => {
    return forceShowDetail.value || Boolean(!props.simulationRetirementOption.isGranted && getProjectedRetirementDateIsAfterToday.value)
  })
  
</script>