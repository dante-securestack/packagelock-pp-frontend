<template>
  <AppBaseModal :show="showModal" @close="close">
    <div class="w-full flex flex-col space-y-4">

      <h3 class="h3 border-l-10 border-orange-500 pl-6 leading-normal mb-4">
        <span>Atualizar expectativa de vida</span>
      </h3>

      <AppInputWithIcon 
        v-model:value="lifeExpectation.age" 
        icon="badge"
        label="Idade" 
        placeholder="Idade"
        :disabled="lifeExpectation.id ? true : false" 
        :mask="'##'"
        type="tel"
      >
      </AppInputWithIcon>
      
      <AppInputWithIcon 
        v-model:value="lifeExpectation.yearReference" 
        icon="badge"
        label="Ano de referência" 
        placeholder="Ano de referência"
        :disabled="lifeExpectation.id ? true : false" 
        :mask="'####'"
        type="tel"
      >
      </AppInputWithIcon>
      
      <AppInputWithIcon 
        v-model:value="lifeExpectation.male" 
        icon="badge"
        label="Exp. homem" 
        placeholder="Exp. homem"
        :mask="'##.#'"
        type="tel"
      >
      </AppInputWithIcon>
      
      <AppInputWithIcon 
        v-model:value="lifeExpectation.female" 
        icon="badge"
        label="Exp. mulher" 
        placeholder="Exp. mulher"
        :mask="'##.#'"
        type="tel"
      >
      </AppInputWithIcon>

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

  import AdminGeneralApiService from '@/services/api/AdminGeneralApiService'
  import LifeExpectation from '@/entities/LifeExpectation'
  import emitter from '@/util/emitter'
  
  const router = useRouter()
  
  const emit = defineEmits(['close'])

  onMounted(() => {
    emitter.on('openLifeExpectationEditModal', (lifeExpectationToSet: any) => {
      showModal.value = true
      lifeExpectation.value = new LifeExpectation(lifeExpectationToSet)
      if(lifeExpectation.value.id) getLifeExpectation()
    })

  })

  onBeforeUnmount(() => {
    emitter.off('openSimulationEditModal')
  })

  const showModal = ref(false)
  const lifeExpectation = ref(new LifeExpectation())

  const close = () => {
    showModal.value = false
    emit('close')
  }

  const getLifeExpectation = async () => {
    const query = `
      {
        lifeExpectations (
          where: [
            { column: "", value: "${ lifeExpectation.value.id }" }
          ]
        ) {
          id
          age
          yearReference
          male
          female
        }
      }
    `
    const { data } = await useGraphQL({ query, caller: 'AdminLifeExpectationEditModal' })
    lifeExpectation.value = new LifeExpectation(data.lifeExpectations[0])
  }

  const update = () => {
    
    AdminGeneralApiService.updateOrCreate('LifeExpectation', { ...lifeExpectation.value })
      .then((response) => {
        showModal.value = false
        emit('close')
        emitter.emit('addToast', { message: 'Limite de contribuição atualizado com sucesso', type: 'success', timeout: 5000 })
      })
      .catch((err) => {
        emitter.emit('addToast', { message: 'Erro ao atualizar limite de contribuição', type: 'error', timeout: 5000 })
        console.log(err)
      })

  }


</script>
