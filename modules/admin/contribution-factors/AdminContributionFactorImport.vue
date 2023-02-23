<template>
  
  <div class="w-full flex flex-wrap space-y-6">

    <div class="w-full flex flex-wrap items-center space-y-4">
      <AppTitle>Importar tabelas de correção</AppTitle>
    </div>

    <div v-if="!importMonetaryAndFactorCorrection?.result.length" class="w-full flex flex-wrap space-y-6">
      <AppAlert>
        <p>Acesse este documento para obter mais informações sobre a importação de tabelas de correção: 
          <a class="font-bold text-sky-500" href="/docs/pop_importacao_correcao.pdf" target="_blank">
            Instruções de importação
          </a>
          e utilize este template para importação: 
          <a class="font-bold text-sky-500" href="https://docs.google.com/spreadsheets/d/1Iih2OlFsm24WIZJiXG5TizITOlZqimRI4SgoSP7P04o/edit?usp=sharing" target="_blank">
            Planilha modelo para importação
          </a>
        </p>
      </AppAlert>

      <AppInputWithIcon 
        v-model:value="importMonetaryAndFactorCorrection.baseMonth" 
        type="tel"
        :mask="'##/####'" 
        label="Mês base" 
        icon="calendar_month" 
        placeholder="DD/MM/AAAA"
      >
        Preencha a data corretamente
      </AppInputWithIcon>

      <div class="w-full flex flex-col">
        <label class="block mb-2">
          <span class="border-b-4 border-zinc-200 ">Tipo de tabela</span>
        </label>
        <div class="w-full flex space-x-6">
          <AppButton 
            v-for="type in sheetTypes"
            :key="type"
            @click="importMonetaryAndFactorCorrection.sheetName = type.label" 
            class="flex flex-col items-center justify-center py-2 px-6 border transition-all duration-100" 
            :class="[importMonetaryAndFactorCorrection.sheetName === type.label ? 'shadow-lg scale-105 bg-white' : 'border-slate-200 text-gray-300']"
          >
            <span>{{ type.label }}</span>
          </AppButton>
        </div>
      </div>

      <AppUploadInput 
        placeholder="Clique ou arraste aqui uma planilha do template (.XLS, .XLSX)"
        v-model="importMonetaryAndFactorCorrection.file" 
        accept=".xls,.xlsx"
        label="Tabela Fator de Contribuição"
      >
        Forneça um arquivo CNIS .pdf
      </AppUploadInput>

      <div class="w-full flex">
        <AppButton
          class="bg-brand-gradient text-white px-5"
          @click="processFile()"
          :disabled="!importMonetaryAndFactorCorrection?.file?.name"
        >
          <AppIcons icon="save" />
          <span  class="ml-1">Processar</span>
        </AppButton>
      </div>
    </div>

    <div v-else class="w-full flex flex-wrap space-y-6">
      <AppAlert >
        Confirme a importação dos dados abaixo, os valores zerados serão ignorados durante a importação.
      </AppAlert>

      <AppInputWithIcon
        :disabled="true"
        v-model:value="importMonetaryAndFactorCorrection.baseMonth" 
        type="tel"
        :mask="'##/####'" 
        label="Mês base" 
        icon="calendar_month" 
        placeholder="DD/MM/AAAA"
      ></AppInputWithIcon>

      <div class="w-full flex space-x-4">
        <AppButton
          class="border px-5"
          @click="cancel()"
        >
          <AppIcons icon="close" />
          <span  class="ml-1">Cancelar</span>
        </AppButton>
        <AppButton
          class="bg-brand-gradient text-white px-5"
          @click="updateOrCreate()"
        >
          <AppIcons icon="save" />
          <span  class="ml-1">Importar</span>
        </AppButton>
      </div>

      <AdminContributionFactorTable
        :baseMonth="importMonetaryAndFactorCorrection.baseMonth"
        :contributionFactors="importMonetaryAndFactorCorrection.result"
      />
    </div>

  </div>

</template>

<script setup>

  import ImportMonetaryAndFactorCorrection from '@/services/xls/ImportMonetaryAndFactorCorrection'
  import AdminContributionFactorTable from './AdminContributionFactorTable.vue'
  import { SHEET_TYPE } from './enum'

  const emitter = useEmitter()
  
  const importMonetaryAndFactorCorrection = ref( new ImportMonetaryAndFactorCorrection() )
  const sheetTypes = ref(SHEET_TYPE)

  const processFile = () => {
    importMonetaryAndFactorCorrection.value.processFile()
  }

  const updateOrCreate = () => {
    if(importMonetaryAndFactorCorrection.value.isImporting) {
      emitter.emit('addToast', { message: 'Importação em andamento, aguarde a finalização.' })
      return
    }
    emitter.emit('addToast', { type: 'info', message: 'Iniciando importação' })
    importMonetaryAndFactorCorrection.value.updateOrCreate()
      .then(() => {
        emitter.emit('addToast', { type: 'success', message: 'Tabela importada com sucesso!' })
      })
  }

  const cancel = () => {
    importMonetaryAndFactorCorrection.value = new ImportMonetaryAndFactorCorrection()
  }


</script>