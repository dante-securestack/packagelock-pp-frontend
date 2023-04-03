<template>
  <AppBaseModal :show="showModal" @close="close" :requireAuth="true">
    <div class="w-full flex flex-col space-y-6">
      
      <h3 class="h3 border-l-10 border-orange-500 pl-6 leading-normal mb-4">Adicionar múltiplas contribuições</h3>

      <h5 class="h5 italic" v-if="formMultipleContribution.socialSecurityRelation">Vínculo: <b>#{{ formMultipleContribution.socialSecurityRelation.seqNumber }} {{ formMultipleContribution.socialSecurityRelation.relationOrigin }}</b></h5>

      <AppInputWithIcon 
        v-model:value="formMultipleContribution.startMonthReference" 
        icon="badge"
        label="Início competência" 
        placeholder="Início competência"
        :disabled="true" 
        :mask="'##/####'"
        :hasError="formMultipleContribution.tried && formMultipleContribution.validateInput('startMonthReference')"
      >
        Preencha a data de início corretamente
      </AppInputWithIcon>

      <AppInputWithIcon 
        v-model:value="formMultipleContribution.endMonthReference" 
        icon="badge"
        label="Término competência" 
        placeholder="Término competência"
        :disabled="true" 
        :mask="'##/####'"
        :hasError="formMultipleContribution.tried && formMultipleContribution.validateInput('endMonthReference')"
      >
        Preencha a data de término corretamente
      </AppInputWithIcon>

      <AppSelectInput
        v-model:value="formMultipleContribution.setValueBasedOn"
        :items="formMultipleContribution.MULTIPLE_CONTRIBUTIONS_VALUE_BASED"
        label="Valor baseado em:"
        placeholder="Selecione uma opção"
        :keyLabel="'label'"
        :keyValue="'value'"
        :hasError="formMultipleContribution.tried && formMultipleContribution.validateInput('setValueBasedOn')"
      >
        Selecione uma opção
      </AppSelectInput>

      <AppMoneyInput
        v-if="formMultipleContribution.setValueBasedOn === 'FIXED_VALUE'"
        v-model:value="formMultipleContribution.baseValue" 
        icon="badge"
        label="Valor base" 
        placeholder="Valor"
        :dateReference="formMultipleContribution.monthReference"
        :hasError="formMultipleContribution.tried && formMultipleContribution.validateInput('baseValue')"
      >
        Preencha a o valor base
      </AppMoneyInput>

      <AppCheckBox
        v-model:value="formMultipleContribution.isIgnored"
      >
        Ignorar contribuições
      </AppCheckBox>

      <AppInputWithIcon 
        v-model:value="formMultipleContribution.ignoredReason" 
        icon="badge"
        label="Motivo" 
        placeholder="Insira um motivo de ignorar estas contribuições (opcional)"
        v-if="formMultipleContribution.isIgnored"
      />

      <AppCheckBox
        v-model:value="formMultipleContribution.shouldUpdateExistings"
      >
        Atualizar contribuições existentes
      </AppCheckBox>

      <AppAlert type="warning" v-if="formMultipleContribution.shouldUpdateExistings">
        Atenção! As contribuições existentes no período entre {{ formMultipleContribution.startMonthReference }} e {{ formMultipleContribution.endMonthReference}} 
        do vínculo {{ formMultipleContribution.socialSecurityRelation.relationOrigin }} serão atualizadas de acordo com as informações acima.
      </AppAlert>
      <AppAlert type="warning" v-else>
        Atenção! Esta ação irá criar contribuições mensalmente no período entre {{ formMultipleContribution.startMonthReference }} e {{ formMultipleContribution.endMonthReference}} 
        do vínculo {{ formMultipleContribution.socialSecurityRelation.relationOrigin }} podendo criar contribuições duplicadas caso já existam contribuições no mesmo período para este vínculo.
      </AppAlert>

      <div class="w-full flex justify-end mt-10 block">
        <AppButton bg="bg-brand-gradient space-x-2" text="text-white" @click="update()">
          <AppIcons icon="save" />
          <span>Salvar</span>
        </AppButton>
      </div>

    </div>
  </AppBaseModal>

</template>

<script setup>

  import Api from '@/util/Api'
  import emitter from '@/util/emitter'
  import FormMultipleContribution from '@/forms/FormMultipleContribution'
  import { useAuthStore } from "@/modules/auth/store"
  
  const authStore = useAuthStore()
  const route = useRoute()

  onMounted(() => {
    emitter.on('openModalEditMultipleContributions', ({ socialSecurityRelation }) => {
      showModal.value = true
      formMultipleContribution.value = new FormMultipleContribution(socialSecurityRelation)
      authStore.setRedirectTo({ route: route.fullPath })
    })
  })

  onBeforeUnmount(() => {
    emitter.off('openModalEditMultipleContributions')
  })

  const formMultipleContribution = ref(new FormMultipleContribution())

  const isLoading = ref(false)
  const showModal = ref(false)

  const close = () => {
    showModal.value = false
    formMultipleContribution.value = new FormMultipleContribution()
  }

  const update = () => {
    
    if(formMultipleContribution.value.hasError) {
      formMultipleContribution.value.tried = true
      return
    }

    Api.post(`/app/contribution/multiple/updateOrCreate`, { ...formMultipleContribution.value }).then(({ data }) => {
      isLoading.value = true
      for(const contribution of data.contributions) {
        emitter.emit('contributionUpdated', { contribution })
        emitter.emit('simulationIsPending')
      }
      close()
    })
    .catch((err) => {
      console.log(err)
    })

  }


</script>
