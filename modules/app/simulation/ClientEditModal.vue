<template>
  <AppBaseModal :show="showModal" @close="close">

    <div class="flex flex-col space-y-6" v-if="!loggedUser">

      <h3 class="h3 border-l-10 border-orange-500 pl-6 leading-normal mb-4">
        <span>Nova simulação</span>
      </h3>

      <h5 class="h5">Entre ou cadastre-se para gerar sua simulação</h5>
      <AuthForm />
    </div>

    <template v-else>
      <div class="w-full flex flex-col space-y-4">

        <h3 class="h3 border-l-10 border-orange-500 pl-6 leading-normal mb-4">
          <span v-if="formSimulation.simulationId">Atualizar dados da simulação</span>
          <span v-else>Adicionar nova simulação</span>
        </h3>

        <AppInputWithIcon 
          v-model:value="formSimulation.retirementDate" 
          icon="today"
          label="Data do cálculo *"
          :mask="'##/##/####'"
          type="tel"
          placeholder="Insira a data do cálculo"
          :hasError="formSimulation.tried && formSimulation.validateInput('retirementDate')"
        >
          Preencha a data do cálculo corretamente
        </AppInputWithIcon>

        <AppInputWithIcon 
          v-model:value="formSimulation.name" 
          icon="badge"
          label="Nome *" 
          placeholder="Insira o nome do segurado(a)" 
          :hasError="formSimulation.tried && formSimulation.validateInput('name')"
        >
          Preencha o nome do segurado
        </AppInputWithIcon>

        <AppSelectInput
          v-model:value="formSimulation.gender"
          :items="genders"
          label="Gênero *"
          placeholder="Selecione o gênero"
          :keyLabel="'label'"
          :keyValue="'value'"
          :hasError="formSimulation.tried && formSimulation.validateInput('gender')"
        >
          Preencha o gênero do segurado
        </AppSelectInput>

        <AppInputWithIcon 
          v-model:value="formSimulation.cpf" 
          icon="fact_check"
          label="CPF *" 
          :mask="['###.###.###-##']"
          type="tel"
          placeholder="Insira o cpf" 
          :hasError="formSimulation.tried && formSimulation.validateInput('cpf')"
        >
          Preencha o cpf válido do segurado
        </AppInputWithIcon>

        <AppInputWithIcon 
          v-model:value="formSimulation.birthDate" 
          icon="today"
          label="Data de nascimento *"
          :mask="'##/##/####'"
          type="tel"
          placeholder="Insira a data de nascimento" 
          :hasError="formSimulation.tried && formSimulation.validateInput('birthDate')"
        >
          Preencha a data de nascimento válida DD/MM/AAAA
        </AppInputWithIcon>

        <AppInputWithIcon 
          v-model:value="formSimulation.phone" 
          icon="today"
          label="Telefone *"
          :mask="['(##)#####-####']"
          type="tel"
          placeholder="Insira o telefone" 
          :hasError="formSimulation.tried && formSimulation.validateInput('phone')"
        >
          Preencha o telefone
        </AppInputWithIcon>

        <AppInputWithIcon 
          v-model:value="formSimulation.email" 
          icon="email"
          label="Email *"
          type="email"
          placeholder="Insira o email" 
          :hasError="formSimulation.tried && formSimulation.validateInput('email')"
        >
          Preencha o email
        </AppInputWithIcon>

        <AppInputWithIcon 
          v-model:value="formSimulation.motherName" 
          icon="badge"
          label="Nome da mãe do segurado(a)" 
          placeholder="Insira o nome da mãe do segurado(a)" 
        />

        <AppInputWithIcon 
          v-if="simulation"
          v-model:value="formSimulation.nit" 
          icon="badge"
          label="Nit" 
          placeholder="Insira o NIT do segurado" 
        />

        <AppCheckBox
          v-model:value="formSimulation.hasCustomInputs"
          @change="formSimulation.clearCustomInputs()"
          label="Autorizo que meus dados pessoais e previdenciários sejam utilizados para simulações   de cálculos de benefícios a que faço jus e orientações técnicas dos nossos analistas. "
        >
          Personalizar cálculos da simulação
        </AppCheckBox>

        <AppMoneyInput
          v-if="formSimulation.hasCustomInputs"
          v-model:value="formSimulation.customContributionsPercentage" 
          icon="percent"
          label="Percentual contribuições" 
          placeholder="80,00 %" 
          :inputOptions="{ prefix: '', suffix: ' %', decimals: ',', precision: 2 }"
          :hasError="formSimulation.validateInput('customContributionsPercentage')"
        >
          Preencha o percentual da contribuição (de 0% à 100%)
        </AppMoneyInput>

        <AppInputWithIcon 
          v-if="formSimulation.hasCustomInputs"
          v-model:value="formSimulation.customInitialDate" 
          icon="today"
          label="Data inicial do cálculo"
          :mask="['##/##/####']"
          type="tel"
          placeholder="DD/MM/AAAA" 
          :hasError="formSimulation.validateInput('customInitialDate')"
        >
          Preencha a data inicial do cálculo
        </AppInputWithIcon>

        <AppMoneyInput
          v-if="formSimulation.hasCustomInputs"
          v-model:value="formSimulation.customRetirementFactor" 
          icon="calculate"
          label="Fator de previdênciário" 
          placeholder="1,50 %" 
          :inputOptions="{ prefix: '', suffix: '', decimals: ',', precision: 2 }"
          :hasError="formSimulation.validateInput('customRetirementFactor')"
        >
          Preencha o fator previdênciário (acima de 0)
        </AppMoneyInput>

        <p v-if="formSimulation.hasError" v-html="formSimulation.validationPhraseHtml"></p>

        <div class="w-full flex justify-end mt-10 block">
          <AppButton 
            bg="bg-brand-gradient" 
            text="text-white" 
            @click="updateOrCreate()" 
            :disabled="Boolean(formSimulation.tried && formSimulation.hasError)"
          >
            <span v-if="formSimulation.simulationId">Atualizar</span>
            <span v-else>Continuar</span>
            <AppIcons icon="chevron_right" />
          </AppButton>
        </div>
        
      </div>
    </template>
  </AppBaseModal>

</template>

<script setup>
  import AuthForm from '@/modules/auth/AuthForm'
  import GraphQL from '@/util/GraphQL'
  import Api from '@/util/Api'
  import emitter from '@/util/emitter'
  import { useAppSimulationStore } from '@/modules/app/simulation/store'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from "@/modules/auth/store"
  import FormSimulation from '@/forms/FormSimulation'

  const vueInstance = useVueInstance()
  const authStore = useAuthStore()
  const { loggedUser } = storeToRefs(authStore)
  const appSimulationStore = useAppSimulationStore()

  const router = useRouter()
  const route = useRoute()
  
  defineEmits(['close'])
  
  const props = defineProps({
    simulation: {
      type: [Object]
    }
  })

  const showModal = ref(false)
  const formSimulation = ref(new FormSimulation())
  const genders = ref([
    { label: 'Feminino', value: 'female' },
    { label: 'Masculino', value: 'male' }
  ])

  onMounted(() => {
    emitter.on('openClientEditModal', (client = {}) => {
      showModal.value = true
      formSimulation.value = new FormSimulation(client)
      
      if(client.id) {
        formSimulation.value.clientId = client.id
      }

      if(props.simulation) {
        formSimulation.value.retirementDate = props.simulation.retirementDate
        formSimulation.value.simulationId = props.simulation.id
        formSimulation.value.hasCustomInputs = props.simulation.hasCustomInputs
        formSimulation.value.customContributionsPercentage = props.simulation.customContributionsPercentage
        formSimulation.value.customRetirementFactor = props.simulation.customRetirementFactor
        formSimulation.value.customInitialDate = props.simulation.customInitialDate

        authStore.setRedirectTo({ route: route.fullPath })
      }
    })
  })

  onBeforeUnmount(() => {
    emitter.off('openClientEditModal')
    close()
  })

  const close = () => {
    showModal.value = false
    authStore.setRedirectTo({ route: null })
  }

  const updateOrCreate = () => {

    if(formSimulation.value.hasError) {
      formSimulation.value.tried = true
      return
    }

    Api.post(`/app/client/updateOrCreate`, { ...formSimulation.value }).then(({ data }) => {

      emitter.emit('simulationUpdated')
      close()

      if(!formSimulation.value.simulationId) {
        vueInstance.config.globalProperties.$gtag.event('CRIAR_SIMULAÇÃO_MANUAL', { event_category: 'INTERAÇÕES', value: data.simulation.id })
        router.push(`/simulacao/${data.simulation.id}`)
        appSimulationStore.addSimulationToAttach(data.simulation.id)
      }
    })
    .catch((err) => {
      console.log(err)
    })

  }


</script>
