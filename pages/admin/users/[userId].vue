<template>
  <div class="w-full flex flex-col">

    <div class="w-full flex flex-wrap items-center space-y-4 border-b">
      <AppTitle>{{ typeLabel }} Usuário</AppTitle>
    </div>

    <div class="mt-6 flex flex-col space-y-4">
      
      <AppSelectInput
        v-model:value="formAdminUser.role"
        :items="roles"
        label="Atribuição (ATENÇÃO)"
        :hasError="formAdminUser.tried && formAdminUser.validateInput('role')"
      >
        Selecione a atribuição do usuário
      </AppSelectInput>

      <AppInputWithIcon 
        v-model:value="formAdminUser.name" 
        label="Nome" 
        placeholder="Insira o nome do usuário" 
        :hasError="formAdminUser.tried && formAdminUser.validateInput('name')"
      >
        Preencha o nome
      </AppInputWithIcon>

      <AppInputWithIcon 
        v-model:value="formAdminUser.email" 
        icon="email" 
        type="email" 
        label="Email" 
        placeholder="Insira seu email"
        :hasError="formAdminUser.tried && formAdminUser.validateInput('email')"
      >
        Preencha seu email
      </AppInputWithIcon>
      <AppInputWithIcon 
        v-model:value="formAdminUser.phone" 
        icon="phone" 
        type="tel" 
        label="Telefone" 
        placeholder="Insira o telefone"
        :mask="['(##)####-####', '(##)#####-####']"
        :hasError="formAdminUser.tried && formAdminUser.validateInput('phone')"
      >
        Preencha seu telefone
      </AppInputWithIcon>
      
      <AppInputWithIcon 
        v-model:value="formAdminUser.description" 
        label="Descrição" 
        placeholder="Insira a descrição do usuário" 
        :hasError="formAdminUser.tried && formAdminUser.validateInput('description')"
      >
        Preencha a descrição
      </AppInputWithIcon>

      <AppCheckBox
        v-model:value="formAdminUser.updatedPassword"
      >
        Atualizar senha
      </AppCheckBox>

      <AppInputWithIcon
        v-if="formAdminUser.updatedPassword"
        v-model:value="formAdminUser.unencryptedPassword" 
        icon="key" 
        type="password" 
        label="Senha de acesso" 
        placeholder="Insira a senha de acesso do usuário"
        @keydown.enter="signup()"
        :hasError="formAdminUser.tried && formAdminUser.validateInput('unencryptedPassword')"
      >
        Preencha a senha
      </AppInputWithIcon>

      <AppCheckBox
        v-model:value="formAdminUser.isBlocked"
      >
        Esta bloqueado?
      </AppCheckBox>

      <AppUploadInput 
        placeholder="Clique ou arraste uma imagem de perfil"
        v-model="formAdminUser.file" 
        accept="images/*"
        label="Imagem de perfil"
      />

      <div v-if="formAdminUser.pathUrl" class="w-full flex">
        <AppIcons iconClasses="aspect-ratio h-20" :icon="formAdminUser.pathUrl" />
      </div>

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
import FormAdminUser from '@/forms/admin/FormAdminUser'
import Api from '@/util/Api'
import GraphQL from '@/util/GraphQL'

  const router = useRouter()
  const route = useRoute()
  const { userId } = route.params
  
  const formAdminUser = ref(new FormAdminUser())
  const roles = ref(['ADMIN', 'STANDARD'])

  const typeLabel = computed(() => {
    return userId ? 'Editar' : 'Adicionar'
  })

  const hasError = computed(() => {
    return !formAdminUser.value.title || !formAdminUser.value.content
  })

  onMounted(() => {
    if(userId) getUser()
  })

  const getUser = () => {
    const query = `
      {
        users (
          where: [
            { column: "id", value: "${userId}" }
          ]
        ) {
          key
          id
          name
          email
          phone
          pathUrl
          isBlocked
          role
          description
        }
      }
    `
    GraphQL({ query, caller: 'AdminUser' })
      .then(({ data }) => {
        if(data.users[0]) formAdminUser.value = new FormAdminUser(data.users[0])
      })
  }

  const updateOrCreate = () => {

    if(formAdminUser.value.hasError) {
      formAdminUser.value.tried = true
      return
    }
    AdminGeneralApiService.updateOrCreate('User', { ...formAdminUser.value })
      .then((response) => {
        alert('Usuário atualizado com sucesso')
        router.push(`/admin/users`)
      })
      .catch((err) => {
        alert('Erro ao atualizar usuário')
        console.log(err)
      })
  }
  
</script>
