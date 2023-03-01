<template>

  <div class="w-full mt-4 sm:mt-0 sm:p-4 md:p-6 flex flex-col space-y-6">

    <AppLoaderPlaceholder v-if="!simulationIsReady" />

    <div class="w-full flex justify-end" v-if="simulation.socialSecurityRelations">
      <AppButton 
        bg="bg-brand-gradient text-white text-sm px-2 py-1 mr-4 sm:mr-0"
        @click="openRelationEditModal()"
      >
        <AppIcons icon="add_box" />
        <span class="ml-2">Adicionar novo vínculo</span>
      </AppButton>
    </div>

    <SimulationEmpty v-if="simulation.socialSecurityRelations && !simulation.socialSecurityRelations.length" />

    <RelationCard
      v-for="(socialSecurityRelation, index) in simulation.socialSecurityRelations"
      :key="`simulation-social-security-${index}`"
      :socialSecurityRelation="socialSecurityRelation"
    ></RelationCard>

    <!-- SHARED COMPONENTS -->
    <RelationEditModal />
    <RelationExcludeModal />
    <MultipleContributionEditModal />
    <GroupedContributionDrawer></GroupedContributionDrawer>
    
  </div>

</template>

<script setup>

  import RelationCard from '@/modules/app/simulation/relation/RelationCard'
  import RelationEditModal from '@/modules/app/simulation/relation/RelationEditModal.vue'
  import RelationExcludeModal from '@/modules/app/simulation/relation/RelationExcludeModal.vue'
  import MultipleContributionEditModal from '@/modules/app/simulation/relation/contribution/MultipleContributionEditModal'
  import GroupedContributionDrawer from '@/modules/app/simulation/relation/contribution/GroupedContributionDrawer'
  import SimulationEmpty from '@/modules/app/simulation/relation/SimulationEmpty'
  import SocialSecurityRelation from '@/entities/SocialSecurityRelation'
  import GraphQL from "@/util/GraphQL"
  import emitter from '@/util/emitter'
  import Dates from '@/services/Dates'
  import { ArrayHelpers } from '@igortrindade/lazyfy'
  import { storeToRefs } from 'pinia'
  import { useSharedSimulationStore } from '@/modules/app/simulation/shared-simulation-store'

  const sharedSimulationStore = useSharedSimulationStore()

  const route = useRoute()

  const socialSecurityRelations = ref(false)
  const { simulation, simulationIsReady } = storeToRefs(sharedSimulationStore)

  onMounted(() => {
    emitter.on('contributionUpdated', updateContribution)
    emitter.on('socialSecurityRelationUpdated', updateSocialSecurityRelation)
  })

  onBeforeUnmount(() => {
    emitter.off('contributionUpdated', updateContribution)
    emitter.off('socialSecurityRelationUpdated', updateSocialSecurityRelation)
  })

  const updateContribution = ({ contribution }) => {
    // emitter.emit('simulationIsPending')
  }

  const updateSocialSecurityRelation = ({ socialSecurityRelation }) => {
    sharedSimulationStore.updateContribution(socialSecurityRelation)
  }

  const openRelationEditModal = () => {
    emitter.emit('openRelationEditModal', { socialSecurityRelation: new SocialSecurityRelation({ simulationId: route.params.simulationId }) })
  }

</script>