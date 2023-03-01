<template>
  <AppBaseModal :show="showModal" @close="close" :requireAuth="true">
    <div class="w-full flex flex-col space-y-6">

      <h3 class="h3 border-l-10 border-orange-500 pl-6 leading-normal mb-4">
        <span v-if="formContribution.id">Editar</span>
        <span v-else>Adicionar</span>
        <span> contribuição</span>
      </h3>

      <AppInputWithIcon 
        v-model:value="formContribution.monthReference" 
        icon="badge"
        label="Competência" 
        placeholder="Competência"
        :disabled="true" 
        :mask="'##/####'"
        type="tel"
        :hasError="formContribution.tried && formContribution.validateInput('monthReference')"
      >
        Preencha a competência corretamente MM/AAAA
      </AppInputWithIcon>

      <AppMoneyInput
        v-model:value="formContribution.baseValue" 
        icon="badge"
        label="Valor base" 
        placeholder="Valor"
        :dateReference="formContribution.monthReference"
        :hasError="formContribution.tried && formContribution.validateInput('baseValue')"
      >
        Preencha o valor base
      </AppMoneyInput>

      <AppCheckBox
        v-model:value="formContribution.isIgnored"
      >
        Ignorar contribuição
      </AppCheckBox>

      <AppInputWithIcon 
        v-model:value="formContribution.ignoredReason" 
        icon="badge"
        label="Motivo" 
        placeholder="Insira um motivo de ignorar (opcional)"
        v-if="formContribution.isIgnored"
      />

      <div class="w-full flex justify-end mt-10 block">
        <AppButton bg="bg-brand-gradient space-x-2" text="text-white" @click="update()">
          <AppIcons icon="save" />
          <span v-if="formContribution.id">Atualizar</span>
          <span v-else>Adicionar</span>
        </AppButton>
      </div>

    </div>
  </AppBaseModal>

</template>

<script setup>
  import GraphQL from '@/util/GraphQL'
  import Api from '@/util/Api'
  import FormContribution from '@/forms/FormContribution'
  import emitter from '@/util/emitter'
  
  const authStore = useAuthStore()
  const sharedSimulationStore = useSharedSimulationStore()
  const route = useRoute()

  onMounted(() => {
    emitter.on('openModalEditContribution', ({ id = null, socialSecurityRelationId = null, simulationId = null, monthReference = null, isIgnored = false, ignoredReason = '', baseValue = 0 }) => {
      formContribution.value = new FormContribution({ id, socialSecurityRelationId, simulationId, monthReference, isIgnored, ignoredReason, baseValue })
      showModal.value = true
      authStore.setRedirectTo({ route: route.fullPath })
    })
  })

  onBeforeUnmount(() => {
    emitter.off('openModalEditContribution')
  })

  const formContribution = ref(new FormContribution())
  const isLoading = ref(false)
  const showModal = ref(false)

  const close = () => {
    showModal.value = false
  }

  const get = () => {
    if(!formContribution.value.id) return
    isLoading.value = true

    const query = `
      {
        contributions (
          where: [
            { column: "id", value: "${formContribution.value.id}"}
          ]
        ) {
          id
          simulationId
          socialSecurityRelationId
          monthReference
          baseValue
          isIgnored
          ignoredReason
          baseValue
        }
      }
    `
    GraphQL({ query, caller: 'RelationEditModal' })
      .then(({ data }) => {
        formContribution.value = new FormContribution(data.contributions[0])
        isLoading.value = false
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const update = () => {
    if(isLoading.value) return

    if(formContribution.value.hasError) {
      formContribution.value.tried = true
      return
    }
    
    isLoading.value = true
    Api.post(`/app/contribution/updateOrCreate`, formContribution.value).then(({ data }) => {
      close()
      console.log('finalizou')
      isLoading.value = false
      setTimeout(() => {
        emitter.emit('contributionUpdated', { contribution: data.contribution })
        sharedSimulationStore.updateContribution(data.contribution)
      }, 50)
    })
    .catch((err) => {
      console.log(err)
    })

  }


</script>
