<template>
  <div class="">
    <AppCard>
      <template v-slot:header>
        <div class="w-full flex flex-col pr-12">
        <h3 class="h3 truncate leading-relaxed ...">Calcular aposentadoria com o CNIS</h3>
        <h5>Utilize o arquivo CNIS fornecido pelo INSS para calcular de forma automática a sua aposentadoria</h5>
      </div>
      </template>
      <template v-slot:content>
        <div class="flex flex-col space-y-6">
          
          <p class="text-lg">
            Insira seu extrato do INSS (arquivo CNIS) para calcular sua aposentadoria gratuitamente.
          </p>
          <AppInputWithIcon 
            v-model:value="formCnisFileUpload.retirementDate" 
            type="tel"
            :mask="'##/##/####'" 
            label="Data do cálculo" 
            icon="calendar_month" 
            placeholder="DD/MM/AAAA"
            :hasError="formCnisFileUpload.tried && formCnisFileUpload.validateInput('retirementDate')"
          >
            Preencha a data corretamente
          </AppInputWithIcon>

          <div class="w-full flex flex-col">
            <label class="block mb-2">
              <span class="border-b-4 border-zinc-200 ">Gênero</span>
            </label>
            <div class="w-full flex space-x-6">
              <AppButton 
                @click="formCnisFileUpload.gender = 'man'" 
                class="flex flex-col items-center justify-center py-2 px-6 border transition-all duration-100" 
                :class="[formCnisFileUpload.gender === 'man' ? 'shadow-lg scale-105' : 'border-slate-200 text-gray-300']"
              >
                <AppIcons icon="man" />
                <span>Masculino</span>
              </AppButton>    
              <AppButton 
                @click="formCnisFileUpload.gender = 'female'" 
                class="flex flex-col items-center justify-center py-2 px-6 border transition-all duration-100" 
                :class="[formCnisFileUpload.gender === 'female' ? 'shadow-lg scale-105' : 'border-slate-200 text-gray-300']"
              >
                <AppIcons icon="woman" />
                <span>Feminino</span>
              </AppButton>
            </div>
          </div>

          <AppUploadInput 
            placeholder="Clique ou arraste aqui um arquivo CNIS (.pdf)"
            v-model="formCnisFileUpload.file" 
            accept="application/pdf"
            label="Arquivo CNIS"
            :hasError="formCnisFileUpload.tried && formCnisFileUpload.validateInput('file')"
          >
            Forneça um arquivo CNIS .pdf
          </AppUploadInput>

          <AppCheckBox
            v-model:value="formCnisFileUpload.acceptTerms"
            label="Autorizo que meus dados pessoais e previdenciários sejam utilizados para simulações   de cálculos de benefícios a que faço jus e orientações técnicas dos nossos analistas. "
            :hasError="formCnisFileUpload.tried && formCnisFileUpload.validateInput('acceptTerms')"
          >
            Autorizo que meus dados pessoais e previdenciários sejam utilizados para simulações   de cálculos de benefícios a que faço jus e orientações técnicas dos nossos analistas. 
            <template v-slot:error>
              Necessário aceitar os termos para continuar
            </template>
          </AppCheckBox>


        </div>
        <div class="w-full flex justify-end mt-10 block">
          <AppButton 
            bg="bg-brand-gradient" 
            text="text-white" 
            @click="upload"
          >
            <span>Continuar</span>
            <AppIcons icon="chevron_right" />
          </AppButton>
        </div>

      </template>
    </AppCard>

    <ProcessCnisLoaderModal :showModal="showModalProcessCnisLoader" @close="closeModalProcessCnisLoader" />
  </div>
  
</template>

<script setup>
  
  import ProcessCnisLoaderModal from '@/modules/app/cnis/ProcessCnisLoaderModal.vue'
  import CnisApiService from '@/services/api/CnisApiService'
  import { useAppSimulationStore } from '@/modules/app/simulation/store'
  import { useAuthStore } from '@/modules/auth/store'
  import FormCnisFileUpload from '@/forms/FormCnisFileUpload'

  const emitter = useEmitter()
  const Dates = useDates()
  const appSimulationStore = useAppSimulationStore()
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()

  const formCnisFileUpload = ref(new FormCnisFileUpload())
  const showModalProcessCnisLoader = ref(false)

  const upload = () => {
    
    if(formCnisFileUpload.value.hasError) {
      formCnisFileUpload.value.tried = true
      return
    }

    showModalProcessCnisLoader.value = true

    CnisApiService.upload({ ...formCnisFileUpload.value })
      .then(({ simulation }) => {
        router.push(`/simulacao/${simulation.id}`)
        appSimulationStore.addSimulationToAttach(simulation.id)
      })
      .catch((error) => {
        showModalProcessCnisLoader.value = false
        emitter.emit('addToast', { message: 'Erro ao processar CNIS', type: 'error', timeout: 10000 })
      })
  }

  const closeModalProcessCnisLoader = () => {
    showModalProcessCnisLoader.value = false
  }

</script>