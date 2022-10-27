<template>

  <div class="w-full flex flex-col">

    <div class="w-full flex flex-wrap justify-between items-center">
      <div class="flex items-center cursor-pointer" @click.stop="toggleCard()"> 
        <span 
          class="mr-1 -ml-1 material-icons material-symbols-sharp text-slate-400 flex-none transition-all transform  text-2xl"
          :class="showContent ? 'rotate-90' : 'closed rotate-0'"
        >
          chevron_right
        </span>
        <div class="w-full flex flex-col">
          <h3 class="h3 flex-none text-slate-400">Contribuições</h3>
          <p class="text-xs italic">{{ socialSecurityRelation.contributions.length }} contribuições</p>
        </div>
      </div>

      <div class="ml-auto flex space-x-2">
        <AppButton 
          bg="bg-brand-gradient text-white text-sm px-2 py-1"
          @click="openContributionModal({ socialSecurityRelation })"
        >
          <AppIcons icon="add_box" />
          <span class="ml-2">Adicionar contribuição</span>
        </AppButton>
        <AppButton 
          bg="bg-brand-gradient text-white text-sm px-2 py-1"
          @click="openModalEditMultipleContributions({ socialSecurityRelation })"
        >
          <AppIcons icon="library_add" class="mr-2" />
          <span class="ml-2">Adicionar multiplas</span>
        </AppButton>
      </div>
      <AppAlert v-if="hasContributionsEmpty" type="warning" >
        Encontramos contribuições sem valor neste vínculo, por favor verifique o lançamento.
      </AppAlert>
      <AppAlert v-if="!socialSecurityRelation.contributions.length">Não encontramos contribuições no vínculo {{ socialSecurityRelation.relationOrigin }}, adicione as contribuições manualmente.</AppAlert>
    </div>

    <div class="overflow-x-auto mt-4" v-if="socialSecurityRelation.contributions.length && showContent">

      <table class="table-auto w-full whitespace-nowrap">
        <thead>
          <tr>
            <th>Competência</th>
            <th>Valor base</th>
            <th>Editar</th>
          </tr>
        </thead>
        <ContributionRow 
          :contribution="contribution"
          v-for="(contribution, index) in socialSecurityRelation.contributions"
          :key="`contribution_${ index }`"
        />
      </table>
      
    </div>
  </div>

</template>

<script setup>

  
  import ContributionRow from '@/modules/app/simulation/relation/contribution/ContributionRow'
  import emitter from '@/util/emitter'
  import Dates from '@/services/Dates'
  
  const route = useRoute()

  const contributionMonthReference = ref(null)
  const showContent = ref(false)

  const props = defineProps({
    socialSecurityRelation: Object
  })

  const hasContributionsEmpty = computed(() => {
    return props.socialSecurityRelation.contributions.filter((contribution) => !contribution.baseValue).length > 0
  })

  const openContributionModal = ({ id = null, socialSecurityRelation = null }) => {
    let socialSecurityRelationId, monthReference
    const simulationId = route.params.simulationId
    if(socialSecurityRelation) {
      socialSecurityRelationId = socialSecurityRelation.id
      if(socialSecurityRelation.endAt) monthReference = Dates.format(socialSecurityRelation.endAt, 'MM/yyyy')
    }
    emitter.emit('openModalEditContribution', { id, simulationId, socialSecurityRelationId, monthReference })
  }

  const openModalEditMultipleContributions = ({ socialSecurityRelation }) => {
    emitter.emit('openModalEditMultipleContributions', { socialSecurityRelation })
  }


  const toggleCard = () => {
    showContent.value = !showContent.value
  }

</script>