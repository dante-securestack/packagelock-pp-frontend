<template>
  <div class="w-full flex flex-col">
    <div class="w-full flex flex-col space-y-2">
      <AppInputWithIcon 
        v-model:value="formUserSignup.name" 
        icon="person" 
        type="text" 
        label="Nome" 
        placeholder="Insira seu nome"
        :hasError="formUserSignup.tried && formUserSignup.validateInput('name')"
      >
        Preencha seu nome
      </AppInputWithIcon>
      <AppInputWithIcon 
        v-model:value="formUserSignup.email" 
        icon="email" 
        type="email" 
        label="Email" 
        placeholder="Insira seu email"
        :hasError="formUserSignup.tried && formUserSignup.validateInput('email')"
      >
        Preencha seu email
      </AppInputWithIcon>
      <AppInputWithIcon 
        v-model:value="formUserSignup.phone" 
        icon="phone" 
        type="tel" 
        label="Telefone" 
        placeholder="Insira seu telefone"
        :mask="['(##)####-####', '(##)#####-####']"
        :hasError="formUserSignup.tried && formUserSignup.validateInput('phone')"
      >
        Preencha seu telefone
      </AppInputWithIcon>
      <AppInputWithIcon 
        v-model:value="formUserSignup.unencryptedPassword" 
        icon="key" 
        type="password" 
        label="Senha" 
        placeholder="Insira sua senha"
        @keydown.enter="signup()"
        :hasError="formUserSignup.tried && formUserSignup.validateInput('unencryptedPassword')"
      >
        Preencha a senha
      </AppInputWithIcon>
    </div>
    <div class="w-full flex justify-end mt-8 block">
      <AppButton bg="bg-brand-gradient" text="text-white" @click="signup()">
        <span>Entrar</span>
        <AppIcons icon="chevron_right" />
      </AppButton>
    </div>
  </div>

</template>

<script setup>

  import { useAuthStore } from "@/modules/auth/store"
  import FormUserSignup from '@/forms/FormUserSignup'

  const { emit } = getCurrentInstance()
  const emitter = useEmitter()
  defineEmits(['close', 'setTabSelected'])

  const authStore = useAuthStore()
  const formUserSignup = ref(new FormUserSignup())

  const signup = () => {
    if(formUserSignup.value.hasError) {
      formUserSignup.value.tried = true
      return
    }
    authStore.signup({  ...formUserSignup.value })
      .then(() => {
        emit('close')
        emitter.emit('addToast', { message: 'Cadastrado com sucesso', type: 'success' })
      })
      .catch((err) => {
        if(err && err.response.status == 409) {
          emitter.emit('addToast', { message: 'Você já possui cadastro, por favor realize o login', type: 'error' })
          emit('setTabSelected', 'login')
        } else {
          emitter.emit('addToast', { message: 'Erro ao cadastrar', type: 'error' })
        }
      })
  }

</script>