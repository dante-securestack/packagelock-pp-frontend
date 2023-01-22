import { defineStore } from 'pinia'
import Api from '@/util/Api'

export const useAppSimulationStore = defineStore('appSimulation', {

  persist: true,

  state: () => ({
    simulationsToAttach: [] as Array<string>,
    simulationId: null as string | null,
  }),

  actions: {

    addSimulationToAttach(simulationId: string) {
      this.simulationsToAttach.push(simulationId)
    },
    
    clearSimulationsToAttach() {
      this.simulationsToAttach = []
    },

    attachSimulations() {
      return Api.post(`/app/simulation/attach`, { simulationIds: this.simulationsToAttach })
        .then(({ data }) => {
          this.clearSimulationsToAttach()
        })
    },

    setSimulationId(simulationId: string) {
      this.simulationId = simulationId
    },

    reprocessSimulation() {
      return Api.get(`/app/simulation/reprocess/${this.simulationId}`)
    }

  },
})