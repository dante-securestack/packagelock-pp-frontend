<template>

  <div class="w-full mt-4 sm:mt-0 sm:p-4 md:p-6 flex flex-col space-y-6">

    <AppLoaderPlaceholder v-if="!socialSecurityRelations" />

    <div class="w-full flex justify-end" v-if="socialSecurityRelations">
      <AppButton 
        bg="bg-brand-gradient text-white text-sm px-2 py-1 mr-4 sm:mr-0"
        @click="openRelationEditModal()"
      >
        <AppIcons icon="add_box" />
        <span class="ml-2">Adicionar novo vínculo</span>
      </AppButton>
    </div>

    <SimulationEmpty v-if="socialSecurityRelations && !socialSecurityRelations.length" />

    <RelationCard
      v-for="(socialSecurityRelation, index) in socialSecurityRelations"
      :key="`simulation-social-security-${index}`"
      :socialSecurityRelation="socialSecurityRelation"
    ></RelationCard>

    <!-- SHARED COMPONENTS -->
    <RelationEditModal />
    <RelationExcludeModal />
    <ContributionEditModal />
    <MultipleContributionEditModal />
    <GroupedContributionDrawer></GroupedContributionDrawer>
    
  </div>

</template>

<script setup>

  import RelationCard from '@/modules/app/simulation/relation/RelationCard'
  import RelationEditModal from '@/modules/app/simulation/relation/RelationEditModal.vue'
  import RelationExcludeModal from '@/modules/app/simulation/relation/RelationExcludeModal.vue'
  import ContributionEditModal from '@/modules/app/simulation/relation/contribution/ContributionEditModal'
  import MultipleContributionEditModal from '@/modules/app/simulation/relation/contribution/MultipleContributionEditModal'
  import GroupedContributionDrawer from '@/modules/app/simulation/relation/contribution/GroupedContributionDrawer'
  import SimulationEmpty from '@/modules/app/simulation/relation/SimulationEmpty'
  import SocialSecurityRelation from '@/entities/SocialSecurityRelation'
  import GraphQL from "@/util/GraphQL"
  import emitter from '@/util/emitter'
  import Dates from '@/services/Dates'
  import { ArrayHelpers } from '@igortrindade/lazyfy'
  
  const route = useRoute()

  const socialSecurityRelations = ref(false)

  onMounted(() => {
    getSimulationSocialSecurityRelations()
    emitter.on('contributionUpdated', updateContribution)
    emitter.on('socialSecurityRelationUpdated', updateSocialSecurityRelation)
    emitter.on('simulationUpdated', getSimulationSocialSecurityRelations)
  })

  onBeforeUnmount(() => {
    emitter.off('contributionUpdated', updateContribution)
    emitter.off('socialSecurityRelationUpdated', updateSocialSecurityRelation)
    emitter.off('simulationUpdated', getSimulationSocialSecurityRelations)
  })

  const updateContribution = ({ contribution }) => {

    const socialSecurityRelation = ArrayHelpers.find(socialSecurityRelations.value, { id: contribution.socialSecurityRelationId })
    const finded = ArrayHelpers.find(socialSecurityRelation.contributions, { id: contribution.id })
    if(finded) {
      Object.keys(contribution).map((key) => {
        finded[key] = contribution[key]
      })
    } else {
      socialSecurityRelation.contributions.push(contribution)
      orderSocialSecurityRelations()
    }
  }

  const updateSocialSecurityRelation = ({ socialSecurityRelation }) => {

    const finded = ArrayHelpers.find(socialSecurityRelations.value, { id: socialSecurityRelation.id })
    if(finded) {
      Object.keys(socialSecurityRelation).map((key) => {
        finded[key] = socialSecurityRelation[key]
      })
    } else {
      socialSecurityRelations.value.push(socialSecurityRelation)
    }
    orderSocialSecurityRelations()
  }

  const getSimulationSocialSecurityRelations = () => {
    const query = `

      {

        simulation ( 
          where: [
            { column: "id", value: "${route.params.simulationId}" }
          ]
        ) {
          id
          retirementDate
          socialSecurityRelations {
            id
            simulationId
            seqNumber
            nit
            relationDocument
            relationOrigin
            relationType
            startAt
            endAt
            specialTime
            lastPaymentAt
            indicators
            history
            isIgnored
            ignoredReason
            contributionTime
            contributions (
              order: [
                { column: "key" }
              ]
            ) {
              key
              id
              socialSecurityRelationId
              monthReference
              baseValue
              valueAfterCheckLimit
              valueAfterCorrection
              finalValue
              isIgnored
              ignoredReason
              groupedContributionsQuantity
              history
            }
          }
          
        }
      }
    
    `

    const init = new Date().getTime()

    GraphQL({ query, delay: 1000 }).then(({ data }) => {
      socialSecurityRelations.value = data.simulation.socialSecurityRelations
      orderSocialSecurityRelations()
    })

  }

  const orderSocialSecurityRelations = () => {
    socialSecurityRelations.value.sort((a, b) => {
      return a.seqNumber - b.seqNumber
    })
    for(const socialSecurityRelation of socialSecurityRelations.value) {
      socialSecurityRelation.contributions.sort((a, b) => {
        return Dates.parse(a.monthReference) - Dates.parse(b.monthReference)
      })
    }
  }

  const openRelationEditModal = () => {
    emitter.emit('openRelationEditModal', { socialSecurityRelation: new SocialSecurityRelation({ simulationId: route.params.simulationId }) })
  }

</script>