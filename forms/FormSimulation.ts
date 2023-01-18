
import BaseFormModel from "@/forms/BaseFormModel"
import Validators from '@/forms/Validators'
import { useAuthStore } from "@/modules/auth/store"
export default class FormSimulation extends BaseFormModel {

  retirementDate: string = ''
  simulationId: string = ''
  clientId: string = ''
  name: string = ''
  email: string = ''
  phone: string = ''
  birthDate: string = ''
  motherName: string = ''
  cpf: string = ''
  nit: string = ''
  gender: string = ''
  acceptTerms: boolean = false
  hasCustomInputs: boolean = false
  customContributionsPercentage: number = 0
  customRetirementFactor: number | null = null
  customInitialDate: string | null = null

  constructor(data) {
    super()
    this.setFillableKeys(data)
  }

  get fillable() {
    return [
      'retirementDate',
      'simulationId',
      'clientId',
      'name',
      'email',
      'phone',
      'birthDate',
      'motherName',
      'cpf',
      'nit',
      'gender',
      'acceptTerms',
      'hasCustomInputs',
      'customContributionsPercentage',
      'customRetirementFactor',
      'customInitialDate',
    ]
  }

  get requireds(): any[] {
    return [
      {
        item: 'retirementDate',
        label: 'data do cálculo',
        validator: ['minLength:10', 'dateIsValid']
      },
      {
        item: 'name',
        label: 'nome do segurado(a)',
        validator: ['minLength:8', 'minWords:2']
      },
      {
        item: 'email',
        label: 'email',
        validator: (value: number, instance: FormSimulation) => {
          const authStore = useAuthStore()
          if(authStore.loggedUser?.role == 'ADMIN') return false
          if(Validators.emailValidator(value)) return true
          return false
        }
      },
      {
        item: 'phone',
        label: 'telefone',
        validator: (value: number, instance: FormSimulation) => {
          const authStore = useAuthStore()
          if(authStore.loggedUser?.role == 'ADMIN') return false
          if(Validators.phoneValidator(value)) return true
          return false
        }
      },
      {
        item: 'birthDate',
        label: 'data de nascimento do segurado(a)',
        validator: ['minLength:10', 'dateIsValid']
      },
      {
        item: 'cpf',
        label: 'cpf do segurado(a)',
        validator: 'cpfValidator'
      },
      {
        item: 'gender',
        label: 'gênero do segurado(a)',
      },
      {
        item: 'customContributionsPercentage',
        label: 'porcentagem de cálculos',
        validator: (value: number, instance: FormSimulation) => {
          if(!instance.hasCustomInputs || value === null) return false
          return !(value > 0 && value <= 100)
        }
      },
      {
        item: 'customInitialDate',
        label: 'data inicial do cálculo',
        validator: (value: string, instance: FormSimulation) => {
          if(!instance.hasCustomInputs || value === null) return false
          if(Validators.minLength(value, 10)) return true
          if(Validators.dateIsValid(value)) return true
          return false
        }
      },
      {
        item: 'customRetirementFactor',
        label: 'fator de aposentadoria',
        validator: (value: number, instance: FormSimulation) => {
          if(!instance.hasCustomInputs) return false
          if(value == 0 || value == null) return false
          return !(value > 0 && value <= 100)
        }
      },
    ]
  }

  clearCustomInputs() {
    if(!this.hasCustomInputs) {
      this.customContributionsPercentage = 80
      this.customRetirementFactor = null
      this.customInitialDate = null
    }
  }

}