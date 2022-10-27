<template>
  
  <div class="w-full flex flex-wrap space-y-2">
    <AppLabelValue class="four-cols-breakdown">
      <template v-slot:label>Cadastrado em</template>
      <template v-slot:value>{{ client.createdAt }}</template>
    </AppLabelValue>
    <AppLabelValue class="four-cols-breakdown">
      <template v-slot:label>Usuário</template>
      <template v-slot:value>{{ client.name }}</template>
    </AppLabelValue>
    <AppLabelValue class="four-cols-breakdown">
      <template v-slot:label>Email</template>
      <template v-slot:value>{{ client.email }}</template>
    </AppLabelValue>
    <AppLabelValue class="four-cols-breakdown">
      <template v-slot:label>Telefone</template>
      <template v-slot:value>{{ client.phone }}</template>
    </AppLabelValue>
    <AppLabelValue class="four-cols-breakdown">
      <template v-slot:label>CPF</template>
      <template v-slot:value>{{ client.cpf }}</template>
    </AppLabelValue>
  </div>


  <div class="w-full flex flex-wrap justify-between items-center">
    <div class="flex items-center cursor-pointer" @click.stop="toggleCard()">
      <span 
        class="mr-1 -ml-1 material-icons material-symbols-sharp text-slate-400 flex-none transition-all transform  text-2xl"
        :class="showContent ? 'rotate-90' : 'closed rotate-0'"
      >
        chevron_right
      </span>
      <div class="w-full flex flex-col">
        <h3 class="h3 flex-none text-slate-400">Simulações</h3>
        <p class="text-xs italic">{{ client.simulations.length }} simulações</p>
      </div>
    </div>
    <LabelIsGranted class="" :isGranted="clientHasGranted" />
  </div>

  <div class="overflow-x-auto mt-4" v-if="client.simulations.length && showContent">

    <table class="table-auto w-full whitespace-nowrap">
      <thead>
        <tr>
          <th>Gerada em</th>
          <th>Data cálculo</th>
          <th>Tem direito?</th>
          <th>Primeira aposentadoria</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="simulation in client.simulations"
          :key="simulation.id"
          :class="[simulation.isGranted ? 'bg-teal-700/10' : 'bg-gray-50 hover:bg-gray-100']"
        >
          <td>{{ simulation.createdAt }}</td>
          <td>{{ simulation.retirementDate }}</td>
          <td><AppBooleanLabel :value="simulation.isGranted" /></td>
          <td>{{ simulation.firstProjectedRetirementDate || '--' }}</td>
          <td>
            <div class="flex">
              <NuxtLink :to="`/simulacao/${simulation.id}`" class="w-auto">
                <AppButton title="Visualizar" class="hover:text-orange-600 text-slate-400">
                  <AppIcons icon="zoom_in" />
                </AppButton>
              </NuxtLink>
              <a v-if="simulation.cnisFile" :href="simulation.cnisFile.pathUrl" target="_blank">
                <AppButton title="Download CNIS" class="text-zinc-400 hover:text-orange-600 text-slate-400">
                  <AppIcons icon="picture_as_pdf" />
                </AppButton>
              </a>
            </div>

          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script setup>

  import LabelIsGranted from '@/modules/app/simulation/result/LabelIsGranted.vue'

  const props = defineProps({
    client: Object
  })

  const showContent = ref(false)

  const clientHasGranted = computed(() => {
    return Boolean(props.client.simulations.length && props.client.simulations.filter((simulation) => simulation.isGranted).length)
  })

  const toggleCard = () => {
    showContent.value = !showContent.value
  }

</script>