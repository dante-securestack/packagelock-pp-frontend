<template>
  <div class="w-full flex flex-col">

    <div class="w-full flex flex-wrap items-center space-y-4 border-b">
      <AppTitle>{{ typeLabel }} Grupos de aposentadoria</AppTitle>
    </div>

    <div class="mt-6 flex flex-col space-y-4">
      <AppInputWithIcon 
        v-model:value="formAdminRetirementGroup.title"
        label="Título"
        placeholder="Insira o título do grupo de aposentadoria"
        :hasError="formAdminRetirementGroup.tried && formAdminRetirementGroup.validateInput('title')"
      >
        Preencha o título
      </AppInputWithIcon>

      <AppTextEditorInput 
        input_id="retirement-group-editor" 
        v-model:value="formAdminRetirementGroup.description" 
        label="Descrição curta (até 3 linhas)"
        height="100"
        :hasError="formAdminRetirementGroup.tried && formAdminRetirementGroup.validateInput('description')"
      >
        Preencha uma descrição
      </AppTextEditorInput>

      <AppTextEditorInput 
        input_id="retirement-group-editor" 
        v-model:value="formAdminRetirementGroup.content" 
        label="Descrição completa"
        :hasError="formAdminRetirementGroup.tried && formAdminRetirementGroup.validateInput('content')"
      >
        Preencha o conteúdo
      </AppTextEditorInput>

      <AppCheckBox
        v-model:value="formAdminRetirementGroup.isPreReform"
      >
        É pré reforma
      </AppCheckBox>

      <div class="w-full flex">
        <AppButton
          class="bg-brand-gradient text-white px-5"
          @click="updateOrCreate()"
        >
          <AppIcons icon="save" />
          <span  class="ml-1">Salvar</span>
        </AppButton>
      </div>
    </div>


  </div>

</template>

<script setup>

import AdminGeneralApiService from '@/services/api/AdminGeneralApiService'
import FormAdminRetirementGroup from '@/forms/admin/FormAdminRetirementGroup'
import Api from '@/util/Api'
import GraphQL from '@/util/GraphQL'

  const router = useRouter()
  const route = useRoute()
  const formAdminRetirementGroup = ref(new FormAdminRetirementGroup())
  const { type, retirementGroupId } = route.params
  const typeLabel = computed(() => {
    return type == 'edit' ? 'Editar' : 'Adicionar'
  })

  onMounted(() => {
    if(retirementGroupId) get()
  })

  const get = () => {
    const query = `
      {
        retirementGroups (
          where: [
            { column: "id", value: "${retirementGroupId}" }
          ]
        ) {
          key
          id
          title
          description
          content
          isPreReform
        }
      }
    `

    GraphQL({ query, caller: 'AdminRetirementGroup' })
      .then(({ data }) => {
        formAdminRetirementGroup.value = new FormAdminRetirementGroup(data.retirementGroups[0])
      })
  }

  const updateOrCreate = () => {

    if(formAdminRetirementGroup.value.hasError) {
      formAdminRetirementGroup.value.tried = true
      return
    }

    AdminGeneralApiService.updateOrCreate('RetirementGroup', { ...formAdminRetirementGroup.value })
      .then((response) => {
        alert('Grupo de aposentadoria atualizado com sucesso')
        router.push(`/admin/retirement-groups`)
      })
      .catch((err) => {
        alert('Erro ao atualizar grupo de aposentadoria')
        console.log(err)
      })
  }
  
</script>
