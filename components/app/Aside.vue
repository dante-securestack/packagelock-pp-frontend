<template>

  <transition name="fade">
    <div 
      v-if="showMenu"
      @click="toggleDrawer()"
      class="w-screen fixed z-20 inset-0 bg-slate-800 bg-opacity-50"
    ></div>
  </transition>
  <transition
    enter-active-class="translate-x-full"
    enter-class=""
    enter-to-class=""
    leave-active-class=""
    leave-class=""
    leave-to-class="translate-x-full"
    mode="out-in"
  >
    <aside 
      v-if="showMenu" 
      ref="baseDrawer"
      class="base-aside-dialog z-30 transition-all duration-200 easy-in-out transform bg-brand-gradient overflow-y-auto"
    >

      <button
        @click="toggleDrawer()"
        class="
          absolute
          top-0
          right-0
          text-white
          pr-4
          pt-5
          focus:outline-none
        "
      >
        <AppIcons icon="close" size="32" />
      </button>

      <ul 
        v-for="(group, index) in groups" 
        :key="`aside-group-${index}`"
        class="mt-4"
        v-show="checkPermission(group.roles)"
      >
        <h3 v-if="group.title"><span class="block text-2xl text-amber-500 pl-5 mb-4">
          <span class="border-b-2 border-zinc-400">{{ group.title }}</span></span>
        </h3>
        <li 
          v-for="(item, index) in group.items" 
          :key="`aside-item-${index}`"
          class="font-thin text-xl text-white mb-4 border-l-4 hover:border-amber-600 pl-4"
          v-show="checkPermission(item.roles)"
          :class="[route.path == item.action ? 'border-amber-600' : 'border-transparent']"
        >
          <button @click="makeAction(item.action)">{{ item.title }}</button>
        </li>
      </ul>

    </aside>
  </transition>

  <!-- GLOBAL MODALS PLACEHOLDER -->
  <AuthFormModalVue :showAuthModal="showAuthModal" @close="closeAuthModal"/>

</template>

<script setup>

  import AuthFormModalVue from '@/modules/auth/AuthFormModal.vue'
  import { getCurrentInstance } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from "@/modules/auth/store"
  import emitter from '@/util/emitter'

  const { emit, refs } = getCurrentInstance()
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  defineEmits(['update:showMenu'])

  const props = defineProps({
    showMenu: Boolean
  })

  const { loggedUser } = storeToRefs(authStore)

  const showAuthModal = ref(false)

  const groups = ref([
    {
      items: [
        {
          title: 'Calcule sua aposentadoria',
          action: '/calcule-sua-aposentadoria'
        },
        {
          title: 'Revisão da Vida Toda',
          action: () => {
            emitter.emit('openContactModal')
          }
        },
        {
          title: 'Artigos e notícias',
          action: '/artigos'
        },
        {
          title: 'Minhas simulações',
          action: '/minhas-simulacoes',
          roles: ['STANDARD', 'ADMIN'],
        },
        {
          title: 'Entre ou cadastre-se',
          roles: 'NONE',
          action: () => {
            showAuthModal.value = true
            authStore.setRedirectTo({ route: 'general' })
          }
        }
      ]
    },
    {
      title: 'Gerenciamento',
      roles: ['ADMIN'],
      items: [
        {
          title: 'Simulações',
          action: '/admin/simulations'
        },
        {
          title: 'Usuários',
          action: '/admin/users'
        },
        {
          title: 'Segurados',
          action: '/admin/clients'
        },
        {
          title: 'Dashboard',
          action: '/admin/dashboard'
        },
      ]
    },
    {
      title: 'Plataforma',
      roles: ['ADMIN'],
      items: [
        {
          title: 'Artigos',
          action: '/admin/articles'
        },
        {
          title: 'Categorias',
          action: '/admin/categories'
        },
        {
          title: 'Tabelas de correção',
          action: '/admin/contribution-factors'
        },
        {
          title: 'Limites contribuição',
          action: '/admin/contribution-limits'
        },
        {
          title: 'Grupos de aposentadoria',
          action: '/admin/retirement-groups'
        },
        {
          title: 'Regras de aposentadoria',
          action: '/admin/retirement-options'
        },
      ]
    },
    {
      items: [
        {
          title: authStore.loggedUser ? authStore.loggedUser.email : '',
          roles: 'ANY',
          action: () => { }
        },
        {
          title: 'Sair',
          roles: 'ANY',
          action: () => {
            authStore.logout()
            router.push('/')
          }
        },
      ]
    }
  ])

  onMounted(() => {
    emitter.on('openAuthModal', () => {
      showAuthModal.value = true
      console.log('abril modal auth')
    })
  })

  onUnmounted(() => {
    emitter.off('openAuthModal')
  })

  const toggleDrawer = () => {
    if(!props.showMenu) {
      addListeners()
    } else {
      removeListeners()
    }
    emit('update:showMenu', !props.showMenu)
  }

  const addListeners = () => {
    document.addEventListener("click", handleClickOutside)
    document.addEventListener("keyup", handleEsc)
  }

  const removeListeners = () => {
    document.removeEventListener("click", handleClickOutside)
    document.removeEventListener("keyup", handleEsc)
  }

  const handleEsc = (evt) => {
    if (props.showMenu && evt.keyCode === 27) toggleDrawer()
  }

  const handleClickOutside = (event) => {
    if (!(refs['aside'] == event.target || refs['aside'] && refs['aside'].contains(event.target))) {
      toggleDrawer()
    }
  }

  const makeAction = (action) => {
    if(typeof(action) === 'string') return router.push(action)
    action()
  }
  
  const checkPermission = (roles) => {
    if(!roles) return true
    if(roles === 'ANY' && loggedUser.value) return true
    if(roles === 'NONE' && !loggedUser.value) return true
    return loggedUser.value && roles.includes(loggedUser.value.role)
  }

  const closeAuthModal = () => {
    showAuthModal.value = false
  }

  defineExpose({
    toggleDrawer
  })


</script>

<style lang="scss">
  .base-aside-dialog {
    @apply pt-24 p-10 fixed top-0 right-0 h-screen w-full shadow-lg flex flex-col overflow-hidden 
  }

  @media (min-width: 576px) {
    .base-aside-dialog {
      @apply min-w-xl max-w-xl;
    }
  }
</style>
