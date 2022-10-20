<template>
  <teleport to="body">
    <transition name="fade" :duration="550">
      <div
        v-if="show"
        class="
          fixed
          inset-0
          bg-slate-800/70
          flex
          items-center
          justify-center
          z-50
          p-4
          md:p-6
          lg:p-8
          xl:p-12
          overflow-y-auto
        "
      >
        <!-- MODEL DIALOG -->
        <div :class="[dialogClasses]" class="
          bg-white
          shadow
          p-6
          md:p-6
          lg:p-8
          xl:p-12
          relative
          my-auto
          transition-fade-inner
        " v-if="show">
          <button
            v-if="allowClose"
            @click="close()"
            class="
              absolute
              top-0
              right-0
              text-ash-500
              pr-4
              pt-5
              focus:outline-none
            "
          >
            <AppIcons icon="close" />
          </button>
          <div class="w-full mt-8">

            <h3 v-if="title" class="h3 border-l-10 border-orange-500 pl-6 leading-normal mb-4">
              <span>{{ title }}</span>
            </h3>

            <div class="flex flex-col space-y-6" v-if="requireAuth && !loggedUser">
              <h3 class="h3 border-l-10 border-orange-500 pl-6 leading-normal mb-4">
                <span>Login</span>
              </h3>

              <h5 class="h5">Entre ou cadastre-se para editar os dados.</h5>
              <AuthForm />
            </div>

            <slot v-else />

          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>

  import AuthForm from '@/modules/auth/AuthForm'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from "@/modules/auth/store"
  import FormSimulation from '@/forms/FormSimulation'

  const vueInstance = useVueInstance()
  const authStore = useAuthStore()
  const { loggedUser } = storeToRefs(authStore)

  const { emit } = getCurrentInstance()

  defineEmits(['close', 'open'])

  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    },
    dialogClasses: {
      type: String,
      default: 'w-full max-w-3xl'
    },
    allowClose: {
      type: Boolean,
      default: true
    },
    requireAuth: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
  })

  const close = () => {
    emit('close')
  }

  watch(() => props.show, (newValue) => {
    if(newValue) {
      emit('open')
      document.addEventListener("keyup", handleEsc)
    } else {
      document.removeEventListener("keyup", handleEsc)
    }
  })

  const handleEsc = (event) => {
    if (props.allowClose && props.show && event.keyCode === 27) close()
  }

</script>

<style scoped>

  .fade-enter-active .transition-fade-inner,
  .fade-leave-active .transition-fade-inner {
    transition: all 0.3s ease-in-out;
  }

  .fade-leave-active {
    transition-delay: 0.15s;
  }

  .fade-enter-from .transition-fade-inner,
  .fade-leave-to .transition-fade-inner {
    transform: translateY(30px);
    opacity: 0;
  }
</style>
