<template>
  <AppBaseModal :show="showModal" @close="close" :requireAuth="true">
    <div class="w-full flex flex-col space-y-4">

      <h3 class="h3 border-l-10 border-orange-500 pl-6 leading-normal mb-4">
        <span v-if="formSocialSecurityRelation.id">Atualizar</span>
        <span v-else>Adicionar</span>
        <span> vínculo</span>
      </h3>

      <AppInputWithIcon 
        v-model:value="formSocialSecurityRelation.relationOrigin" 
        icon="badge"
        label="Nome" 
        placeholder="Insira o nome do vínculo"
        :hasError="formSocialSecurityRelation.tried && formSocialSecurityRelation.validateInput('relationOrigin')"
      >
        Preencha o nome do vínculo
      </AppInputWithIcon>

      <AppInputWithIcon 
        v-model:value="formSocialSecurityRelation.relationDocument" 
        icon="fact_check"
        label="Documento" 
        :mask="['###.###.###-##', '##.###.###/####-##']"
        type="tel"
        placeholder="Insira o documento do vínculo (CPF ou CNPJ" 
        :hasError="formSocialSecurityRelation.tried && formSocialSecurityRelation.validateInput('relationDocument')"
      >
        Preencha o CPF ou CNPJ do vínculo
      </AppInputWithIcon>

      <AppSelectInput
        v-model:value="formSocialSecurityRelation.relationType"
        :items="relationTypes"
         icon="contact_page"
        label="Tipo de vínculo"
        placeholder="Selecione o tipo de vínculo" 
        :hasError="formSocialSecurityRelation.tried && formSocialSecurityRelation.validateInput('relationType')"
      >
        Preencha o tipo de vínculo
      </AppSelectInput>

      <AppInputWithIcon 
        v-model:value="formSocialSecurityRelation.startAt" 
        icon="today"
        label="Início"
        :mask="'##/##/####'"
        type="tel"
        placeholder="DD/MM/AAAA" 
        :hasError="formSocialSecurityRelation.tried && formSocialSecurityRelation.validateInput('startAt')"
      >
        Preencha a data de início do vínculo
      </AppInputWithIcon>

      <AppInputWithIcon 
        v-model:value="formSocialSecurityRelation.endAt" 
        icon="today"
        label="Término"
        :mask="'##/##/####'"
        type="tel"
        placeholder="DD/MM/AAAA" 
        :hasError="formSocialSecurityRelation.tried && formSocialSecurityRelation.validateInput('endAt')"
      >
        Preencha a data de término do vínculo
      </AppInputWithIcon>

      <AppMoneyInput
        v-model:value="formSocialSecurityRelation.specialTime" 
        icon="timer"
        label="Período especial" 
        placeholder="1,00"
        type="tel"
        :inputOptions="{ decimals: ',', prefix: '', precision: 2 }"
      />

      <AppCheckBox
        v-model:value="formSocialSecurityRelation.isIgnored"
      >
        Ignorar vínculo
      </AppCheckBox>

      <AppInputWithIcon 
        v-model:value="formSocialSecurityRelation.ignoredReason" 
        icon="badge"
        label="Motivo" 
        placeholder="Insira um motivo de ignorar (opcional)"
        v-if="formSocialSecurityRelation.isIgnored"
      />

      <div class="w-full flex justify-end mt-10 block">
        <AppButton bg="bg-brand-gradient" text="text-white" @click="update()">
          <span>Atualizar</span>
          <AppIcons icon="chevron_right" />
        </AppButton>
      </div>
    </div>
  </AppBaseModal>

</template>

<script setup>
  import { getCurrentInstance } from 'vue'
  import GraphQL from '@/util/GraphQL'
  import Api from '@/util/Api'
  import SocialSecurityRelation from '@/entities/SocialSecurityRelation'
  import FormSocialSecurityRelation from '@/forms/FormSocialSecurityRelation'
  import emitter from '@/util/emitter'
  
  const route = useRoute()
  const { emit } = getCurrentInstance()
  
  defineEmits(['close'])

  onMounted(() => {
    emitter.on('openRelationEditModal', ({ socialSecurityRelation: socialSecurityRelationToSet }) => {
      showModal.value = true
      formSocialSecurityRelation.value = new FormSocialSecurityRelation(socialSecurityRelationToSet)
      formSocialSecurityRelation.value.simulationId = route.params.simulationId
    })
  })

  onBeforeUnmount(() => {
    emitter.off('openRelationEditModal')
  })

  const showModal = ref(false)
  const formSocialSecurityRelation = ref(new FormSocialSecurityRelation())

  const relationTypes = ref(['Empregado', 'Empresário / Empregador', 'Autônomo', 'Contribuinte individual', 'Empregado Doméstico', 'Benefício'])

  const isLoading = ref(false)

  const close = () => {
    showModal.value = false
  }

  const update = () => {
    
    if(formSocialSecurityRelation.value.hasError) {
      formSocialSecurityRelation.value.tried = true
      return
    }
    Api.post(`/app/socialSecurityRelation/updateOrCreate`, { ...formSocialSecurityRelation.value }).then(({ data }) => {
      isLoading.value = true
      close()
      emitter.emit('simulationUpdated')
    })
    .catch((err) => {
      console.log(err)
    })

  }


</script>
