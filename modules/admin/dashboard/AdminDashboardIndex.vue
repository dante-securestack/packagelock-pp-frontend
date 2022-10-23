<template>
  
  <div class="w-full flex flex-col space-y-6">

    <div class="w-full flex justify-end">
      <AppDropdown v-model:value="showTimeFrame" ref="dropdown">
        <template v-slot:trigger>
          <div class="w-full flex space-x-4">
            <AppInputWithIcon
              :value="timeFrameSelected.init"
              class="mt-6"
              :label="'Início'"
              :mask="'##/##/####'"
              placeholder="DD/MM/YYYY"
              @blur="timeFrameSelected.init = $event"
            />
            <AppInputWithIcon
              :value="timeFrameSelected.end"
              class="mt-6"
              :label="'Término'"
              :mask="'##/##/####'"
              placeholder="DD/MM/YYYY"
              @blur="timeFrameSelected.end = $event"
            />
          </div>
        </template>
        <template v-slot:items>
          <div class="w-full flex flex-col bg-white p-3 space-y-3 rounded">
            <AppButton
              class="border border-zinc-200"
              v-for="timeFrame in timeFramesAvailable" 
              :key="timeFrame.label"
              @click="setTimeFrame(timeFrame)"
            >
              {{ timeFrame.label }}
            </AppButton>
          </div>
        </template>
      </AppDropdown>
    </div>

    <div class="w-full grid grid-cols-0 md:grid-cols-2 gap-6">
      <AdminDashboardSimulationsChart :init="timeFrameSelected.init" :end="timeFrameSelected.end" />
      <AdminDashboardClientsChart :init="timeFrameSelected.init" :end="timeFrameSelected.end" />
    </div>
  </div>
</template>

<script setup>
  
  import AdminDashboardSimulationsChart from '@/modules/admin/dashboard/AdminDashboardSimulationsChart'
  import AdminDashboardClientsChart from '@/modules/admin/dashboard/AdminDashboardClientsChart'
  import getTimeFrames from '@/util/functions/getTimeFrames'

  const showTimeFrame = ref(false)
  const timeFramesAvailable = ref(getTimeFrames)
  const timeFrameSelected = ref(getTimeFrames[5])

  const dropdown = ref(null)

  const setTimeFrame = (timeFrame) => { 
    timeFrameSelected.value = timeFrame
    dropdown.value.close()

  }

</script>