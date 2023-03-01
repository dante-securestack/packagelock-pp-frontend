<template>
  <tbody :class="[contribution.isIgnored ? 'bg-orange-200/40' : 'bg-gray-50 hover:bg-gray-100']">
    <tr>
      <td>
        <div class="flex items-center">
          <div class="w-6 flex items-center">
            <AppButton 
              title="Histórico de edições da contribuição"
              @click="toggleCard()"
              class="mr-1 -ml-3 material-icons material-symbols-sharp flex-none transition-all transform text-2xl cursor-pointer focus:ring-0"
              :class="[
                showContent ? 'rotate-90' : 'closed rotate-0',
                contribution.history.length ? 'text-slate-400' : 'text-slate-400/20'
              ]"
            >
              <AppIcons icon="chevron_right" />
            </AppButton>
          </div>
          <span>{{ contribution.monthReference }}</span>
        </div>
      </td>
      <td>{{ vueNumberFormat(contribution.baseValue, getCurrencyFormatter(contribution.monthReference)) }}</td>
      <td>
        <div class="flex">
          <AppButton 
            title="Editar contribuição"
            :disabled="!loggedUser"
            @click="openContributionModal({ id: contribution.id })"
            class="text-zinc-400 hover:text-orange-600"
          >
            <AppIcons icon="edit" />
          </AppButton>  
          <AppButton 
            :title="!contribution.isIgnored ? `Ignorar contribuição` : `Remover ignorado da contribuição`"
            class="text-zinc-400 hover:text-orange-600"
            :disabled="!loggedUser"
            @click="ignoreContribution(contribution)"
          >
            <AppIcons v-if="!contribution.isIgnored" icon="do_not_disturb_on" />
            <AppIcons v-else icon="add_circle" />
          </AppButton>
          <AppButton 
            title="Contribuições concomitantes no mesmo mês"
            class="hover:text-orange-600"
            :disabled="!loggedUser"
            :class="[contribution.groupedContributionsQuantity > 1 ? 'text-slate-400' : 'text-slate-400/20']"
            @click="openContributionMonthReferenceDrawer(contribution.monthReference)"  
          >
            <AppIcons icon="library_add" />
          </AppButton>
        </div>
      </td>
    </tr>
    <tr>
      <td class="pl-3 border-y" colspan="5" v-if="showContent">
        <h5 class="h5 mb-2">Histórico de edições</h5>
        <div class="pl-3">
          <ul class="w-full list-disc pl-3 whitespace-normal">
            <li v-for="(history, index) in contribution.history" :key="`${contribution.id}_${index}`" >
              {{ history }}
            </li>
          </ul>
          <p v-if="!contribution.history.length">Não existem alterações nesta contribuição</p>
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script setup>

  import Api from '@/util/Api'
  import emitter from '@/util/emitter'
  import getCurrencyType from '@/util/functions/getCurrencyType'
  import Dates from '@/services/Dates'

  import { storeToRefs } from 'pinia'
  import { useAuthStore } from "@/modules/auth/store"
  const authStore = useAuthStore()
  const { loggedUser } = storeToRefs(authStore)

  const props = defineProps({
    contribution: Object
  })
  
  const route = useRoute()

  const showContent = ref(false)
  const isProcessing = ref(false)

  const openContributionModal = () => {
    
    const id = props.contribution.id
    const socialSecurityRelationId = props.contribution.socialSecurityRelationId
    const simulationId = route.params.simulationId
    const monthReference = props.contribution.monthReference
    const isIgnored = props.contribution.isIgnored
    const ignoredReason = props.contribution.ignoredReason
    const baseValue = props.contribution.baseValue

    emitter.emit('openModalEditContribution', { id, simulationId, socialSecurityRelationId, monthReference, isIgnored, ignoredReason, baseValue })
  }

  const openContributionMonthReferenceDrawer = (monthReference) => {
    emitter.emit('openGroupedContributionDrawer', { monthReference })
  }

  const toggleCard = () => {
    showContent.value = !showContent.value
  }

  const getCurrencyFormatter = (monthReference) => {
    return getCurrencyType(monthReference).vueNumberFormatOptions
  }

  const ignoreContribution = (contribution) => {
    if(isProcessing.value) return
    isProcessing.value = true
    const payload = { 
      id: contribution.id,
      isIgnored: !contribution.isIgnored
    }
    
    Api.post(`/app/contribution/updateOrCreate`, payload).then(({ data }) => {
      emitter.emit('contributionUpdated', { contribution: data.contribution })
      isProcessing.value = false
    })
    .catch((err) => {
      console.log(err)
    })

  }

</script>