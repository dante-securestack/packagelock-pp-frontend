import { useSharedSimulationStore as useSharedSimulationStoreImport } from '@/modules/app/simulation/shared-simulation-store'
import { useAuthStore as useAuthStoreImport } from "@/modules/auth/store"

export const useSharedSimulationStore = () => {
  return useSharedSimulationStoreImport()
}

export const useAuthStore = () => {
  return useAuthStoreImport()
}