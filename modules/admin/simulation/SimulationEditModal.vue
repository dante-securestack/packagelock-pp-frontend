<template>
  <AppBaseModal :show="showModal" @close="close">
    <div class="w-full flex flex-col space-y-4">

      <h3 class="h3 border-l-10 border-orange-500 pl-6 leading-normal mb-4">
        <span>Atualizar simulação</span>
      </h3>

      <AppSelectInput
        v-model:value="simulation.status"
        :items="statusTypes"
         icon="contact_page"
        label="Status"
        placeholder="Selecione um status" 
      >
        Status
      </AppSelectInput>
      
      <AppSelectInput
        v-model:value="simulation.userId"
        :items="users"
        keyLabel="name"
        keyValue="id"
         icon="contact_page"
        label="Usuário"
        placeholder="Selecione um usuário" 
      >
        Usuário (opcional)
      </AppSelectInput>

      <div class="w-full flex justify-end mt-10 block">
        <AppButton bg="bg-brand-gradient" text="text-white" @click="update()">
          <span>Atualizar</span>
          <AppIcons icon="chevron_right" />
        </AppButton>
      </div>

    </div>
  </AppBaseModal>

</template>

<script setup lang="ts">
  import { getCurrentInstance } from 'vue'
  import GraphQL from '@/util/GraphQL'
  import AdminGeneralApiService from '@/services/api/AdminGeneralApiService'
  import Simulation from '@/entities/Simulation'
  import emitter from '@/util/emitter'
  
  const router = useRouter()
  const { emit } = getCurrentInstance()
  
  defineEmits(['close'])

  onMounted(() => {
    emitter.on('openSimulationEditModal', ({ simulation: simulationToSet }) => {
      showModal.value = true
      simulation.value = new Simulation(simulationToSet)
    })

    getUsers()
  })

  onBeforeUnmount(() => {
    emitter.off('openSimulationEditModal')
  })

  const showModal = ref(false)
  const simulation = ref(new Simulation())

  const statusTypes = ref(['PENDENTE', 'CRIADA POR ADMIN', 'CRIADA POR USUÁRIO', 'ENTRAR EM CONTATO'])
  const users = ref([])

  const close = () => {
    showModal.value = false
  }

  const getUsers = () => {
    const query = `
      {
        users (
          order: [
            { column: "role" },
            { column: "name" },
          ]
        ) {
          id
          name
          email
          role
        }
      }
    `
    GraphQL({ query, caller: 'SimulationEditModal' })
      .then(({ data }) => {
        users.value = data.users.map((user) => {
          return {
            id: user.id,
            name: `${user.name} (${user.role} - ${user.email})`
          }
        })
      })
  }

  const update = () => {
    
    AdminGeneralApiService.updateOrCreate('Simulation', { id: simulation.value.id, userId: simulation.value.userId, status: simulation.value.status })
      .then((response) => {
        showModal.value = false
        emit('close')
      })
      .catch((err) => {
        emitter.emit('addToast', { message: 'Erro ao atualizar Simulação', type: 'error', timeout: 5000 })
        console.log(err)
      })

  }


</script>
