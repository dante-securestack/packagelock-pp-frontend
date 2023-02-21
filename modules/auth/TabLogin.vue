<template>
  <div class="w-full flex flex-col">
    <div class="w-full flex flex-col space-y-2">
      <AppInputWithIcon 
        v-model:value="user.email" 
        icon="email" 
        type="email" 
        label="Email" 
        placeholder="Insira seu email"
        id="sign-in-email"
      />
      <AppInputWithIcon 
        v-model:value="user.unencryptedPassword" 
        icon="key" 
        type="password" 
        label="Senha" 
        placeholder="Insira sua senha"
        @keydown.enter="login()"
        id="sign-in-password"
      />

      <div class="w-full flex justify-end">
        <NuxtLink class="text-cyan-600" to="/recuperar-senha">
          Esqueceu sua senha?
        </NuxtLink>
      </div>
    </div>
    <div class="w-full flex justify-end mt-8 block">
      <AppButton bg="bg-brand-gradient" text="text-white" @click="login()">
        <span>Entrar</span>
        <AppIcons icon="chevron_right" />
      </AppButton>
    </div>
  </div>

</template>

<script setup>

  import { useAuthStore } from "@/modules/auth/store"
  import User from '@/entities/User'

  const { emit } = getCurrentInstance()
  const emitter = useEmitter()

  defineEmits(['close', 'setTabSelected'])

  const authStore = useAuthStore()
  const user = ref(new User())

  const login = () => {
    authStore.login({ email: user.value.email, unencryptedPassword: user.value.unencryptedPassword })
      .then(() => {
        emit('close')
        emitter.emit('addToast', { message: 'Logado com sucesso!', type: 'success' })
      })
      .catch((err) => {
        if(err && err.response.status == 404) {
          emitter.emit('addToast', { message: 'Você não possui cadastro, por favor cadastre-se.', type: 'error' })
          emit('setTabSelected', 'signup')
        } else {
          emitter.emit('addToast', { message: 'Erro ao logar', type: 'error' })
        }
      })
  }

</script>