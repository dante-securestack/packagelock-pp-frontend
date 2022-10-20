import { defineStore } from 'pinia'

export const useGeneralStore = defineStore('general', {
  persist: true,

  state: () => ({
    userDimissSimulationModal: []
  }),

  actions: {
    setUserDismissSimulationModal(simulationId) {
      this.userDimissSimulationModal.push(simulationId)
    }
  },
})