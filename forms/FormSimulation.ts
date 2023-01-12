
import BaseFormModel from "@/forms/BaseFormModel"
import Validators from '@/forms/Validators'
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
  customRetirementFactor: number = 0
  customInitialDate: string = ''

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
        validator: 'emailValidator'
      },
      {
        item: 'phone',
        label: 'telefone',
        validator: 'phoneValidator'
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
          if(!instance.hasCustomInputs) return false
          return !(value > 0 && value <= 100)
        }
      },
      {
        item: 'customInitialDate',
        label: 'data inicial do cálculo',
        validator: (value: string, instance: FormSimulation) => {
          if(!instance.hasCustomInputs) return false
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
          return !(value > 0 && value <= 100)
        }
      },
    ]
  }

}