<template>
  <AppCard>
    <template v-slot:header>

      <div class="w-full flex flex-col relative">
        <div class="absolute top-0 right-0 flex justify-end">
          <AppButton 
            @click="openClientEditModal()" 
            class="text-zinc-400 hover:text-orange-600">
            <AppIcons icon="edit" />
          </AppButton>
        </div>
        <AppLabelValue>
          <template v-slot:label>Segurado</template>
          <template v-slot:value>{{ client.name }}</template>
        </AppLabelValue>
      </div>
    </template>
    <template v-slot:content>
      <div class="w-full flex flex-wrap justify-between">
        <AppLabelValue class="four-cols-breakdown mt-4">
          <template v-slot:label>Data do cálculo</template>
          <template v-slot:value>{{ simulation.retirementDate }}</template>
        </AppLabelValue>
        <AppLabelValue class="four-cols-breakdown mt-4">
          <template v-slot:label>Cpf</template>
          <template v-slot:value>{{ client.cpf ? client.cpf : '--' }}</template>
        </AppLabelValue>
        <AppLabelValue class="four-cols-breakdown mt-4">
          <template v-slot:label>Data de nascimento</template>
          <template v-slot:value>{{ client.birthDate ? client.birthDate : '--' }}</template>
        </AppLabelValue>
        <AppLabelValue class="four-cols-breakdown mt-4">
          <template v-slot:label>Gênero</template>
          <template v-slot:value>{{ getGender }}</template>
        </AppLabelValue>
        <AppLabelValue class="four-cols-breakdown mt-4">
          <template v-slot:label>Nome mãe</template>
          <template v-slot:value>{{ client.motherName ? client.motherName : '--' }}</template>
        </AppLabelValue>
        
        <div class="w-full">
          <AppButton 
              bg="bg-brand-gradient text-white text-sm px-2 py-1 mr-4 sm:mr-0 mt-2"
              @click="generatePdf()"
              v-if="!simulation.isPendingUpdate && simulation.simulationRetirementGroups.length"
            >
            <AppIcons icon="picture_as_pdf" />
            <span class="ml-2">Imprimir resultado</span>
          </AppButton>
        </div>

      </div>
    </template>
    
  </AppCard>
</template>

<script setup>

  import emitter from '@/util/emitter'
  import SimulationResultService from '@/services/pdf/SimulationResultService'

  const openClientEditModal = () => {
    emitter.emit('openClientEditModal', { ...props.client })
  }

  const getGender = computed(() => {
    if(props.client.gender === 'female') return 'Feminino'
    return 'Masculino'
  })

  const props = defineProps({
    client: Object,
    simulation: Object,
  })

  const showContent = ref(false)

  const toggleCard = () => {
    showContent.value = !showContent.value
  }

  const generatePdf = async () => {

    const pdf = new SimulationResultService({ 
      headline: 'Resultado simulação',
      title: `${ props.simulation.client.name }`,
      id: props.simulation.id,
      subtitle: `${ props.simulation.client.cpf }`,
      simulation: props.simulation
    })

    pdf.generateTables()

    await pdf.export()
  }
  
</script>