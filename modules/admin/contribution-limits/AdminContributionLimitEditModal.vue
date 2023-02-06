<template>
  <AppBaseModal :show="showModal" @close="close">
    <div class="w-full flex flex-col space-y-4">

      <h3 class="h3 border-l-10 border-orange-500 pl-6 leading-normal mb-4">
        <span>Atualizar limite de contribuição</span>
      </h3>

      <AppInputWithIcon 
        v-model:value="contributionLimit.monthReference" 
        icon="badge"
        label="Mês de referência" 
        placeholder="Mês"
        :disabled="contributionLimit.id ? true : false" 
        :mask="'##/####'"
        type="tel"
      >
      </AppInputWithIcon>

      <AppMoneyInput
        v-model:value="contributionLimit.contributionLimit" 
        icon="badge"
        label="Valor teto (limite)" 
        placeholder="Valor teto (limite)"
      >
      </AppMoneyInput>

      <AppMoneyInput
        v-model:value="contributionLimit.contributionMinimum" 
        icon="badge"
        label="Valor mínimo (limite)" 
        placeholder="Valor mínimo (limite)"
      >
      </AppMoneyInput>

      <div class="w-full flex justify-end mt-10 block">
        <AppButton bg="bg-brand-gradient" text="text-white" @click="update()">
          <span>Atualizar</span>
          <AppIcons icon="chevron_right" />
        </AppButton>
      </div>

    </div>
  </AppBaseModal>

</template>

<script setup lang="ts">

  import AdminGeneralApiService from '@/services/api/AdminGeneralApiService'
  import ContributionLimit from '@/entities/ContributionLimit'
  import emitter from '@/util/emitter'
  
  const router = useRouter()
  
  const emit = defineEmits(['close'])

  onMounted(() => {
    emitter.on('openContributionLimitEditModal', (contributionLimitToSet: any) => {
      showModal.value = true
      contributionLimit.value = new ContributionLimit(contributionLimitToSet)
      if(contributionLimit.value.id) getContributionLimit()
    })

  })

  onBeforeUnmount(() => {
    emitter.off('openSimulationEditModal')
  })

  const showModal = ref(false)
  const contributionLimit = ref(new ContributionLimit())

  const close = () => {
    showModal.value = false
    emit('close')
  }

  const getContributionLimit = async () => {
    const query = `
      {
        contributionLimits (
          where: [
            { column: "", value: "${ contributionLimit.value.id }" }
          ]
        ) {
          id
          monthReference
          contributionLimit
          contributionMinimum
        }
      }
    `
    const { data } = await useGraphQL({ query, caller: 'AdminContributionLimitEditModal' })
    contributionLimit.value = new ContributionLimit(data.contributionLimits[0])
  }

  const update = () => {
    
    AdminGeneralApiService.updateOrCreate('ContributionLimit', { ...contributionLimit.value })
      .then((response) => {
        showModal.value = false
        emit('close')
        emitter.emit('addToast', { message: 'Limite de contribuição atualizado com sucesso', type: 'success', timeout: 5000 })
      })
      .catch((err) => {
        emitter.emit('addToast', { message: 'Erro ao atualizar limite de contribuição', type: 'error', timeout: 5000 })
        console.log(err)
      })

  }


</script>
