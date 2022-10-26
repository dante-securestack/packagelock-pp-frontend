<template>
  <div class="w-full flex flex-col">

    <div class="w-full flex flex-wrap items-center space-y-4 border-b">
      <AppTitle>{{ typeLabel }} Regras de aposentadoria</AppTitle>
    </div>

    <div class="mt-6 flex flex-col space-y-4">
      <AppInputWithIcon 
        v-model:value="formAdminRetirementOption.title" 
        label="Título" 
        placeholder="Insira o título do grupo de aposentadoria"
        :hasError="formAdminRetirementOption.tried && formAdminRetirementOption.validateInput('title')"
      >
        Preencha o título
      </AppInputWithIcon>
      
      <AppSelectInput
        v-model:value="formAdminRetirementOption.retirementGroupId"
        :items="retirementGroups"
        label="Grupo de aposentadoria"
        :hasError="formAdminRetirementOption.tried && formAdminRetirementOption.validateInput('retirementGroupId')"
        keyValue="id"
        keyLabel="title"
        placeholder="Selecione uma opção"
      >
        Selecione um grupo de aposentadoria
      </AppSelectInput>
      
      <AppTextEditorInput 
        input_id="retirement-group-editor" 
        v-model:value="formAdminRetirementOption.description" 
        label="Descrição curta (até 3 linhas)"
        height="100"
        :hasError="formAdminRetirementOption.tried && formAdminRetirementOption.validateInput('description')"
      >
        Preencha uma descrição
      </AppTextEditorInput>

      <AppTextEditorInput 
        input_id="retirement-group-editor" 
        v-model:value="formAdminRetirementOption.content" 
        label="Descrição completa"
        :hasError="formAdminRetirementOption.tried && formAdminRetirementOption.validateInput('content')"
      >
        Preencha o conteúdo
      </AppTextEditorInput>

      <AppCheckBox
        v-model:value="formAdminRetirementOption.showForNotLoggedUsers"
      >
        Mostrar para usuários não logados
      </AppCheckBox>

    </div>
    <div class="w-full flex mt-6">
      <AppButton 
        class="bg-brand-gradient text-white px-5"
        @click="updateOrCreate()"
      >
        <AppIcons icon="save" />
        <span  class="ml-1">Salvar</span>
      </AppButton>
    </div>

  </div>

</template>

<script setup>

import FormAdminRetirementOption from '@/forms/admin/FormAdminRetirementOption'
import AdminGeneralApiService from '@/services/api/AdminGeneralApiService'
import Api from '@/util/Api'
import GraphQL from '@/util/GraphQL'

  const router = useRouter()
  const route = useRoute()
  const { retirementOptionId } = route.params

  const formAdminRetirementOption = ref(new FormAdminRetirementOption())
  const retirementGroups = ref([])
  
  const typeLabel = computed(() => {
    return retirementOptionId == 'edit' ? 'Editar' : 'Adicionar'
  })

  onMounted(() => {
    if(retirementOptionId) get()
  })

  const get = () => {
    const query = `
      {
        retirementOptions (
          where: [
            { column: "id", value: "${retirementOptionId}" }
          ]
        ) {
          key
          id
          title
          description
          content
          rule
          retirementGroupId
          showForNotLoggedUsers
          retirementGroup {
            id
            title
          }
        }

        retirementGroups {
          id
          title
        }
      }
    `

    GraphQL({ query, caller: 'AdminRetirementOption' })
      .then(({ data }) => {
        retirementGroups.value = data.retirementGroups
        formAdminRetirementOption.value = new FormAdminRetirementOption(data.retirementOptions[0])
      })
  }

  const updateOrCreate = () => {
    if(formAdminRetirementOption.value.hasError) {
      formAdminRetirementOption.value.tried = true
      return
    }
    AdminGeneralApiService.updateOrCreate('RetirementOption', formAdminRetirementOption.value)
      .then((response) => {
        alert('Regra de aposentadoria atualizado com sucesso')
        router.push(`/admin/retirement-groups`)
      })
      .catch((err) => {
        alert('Erro ao atualizar regra de aposentadoria')
        console.log(err)
      })
  }
  
</script>
