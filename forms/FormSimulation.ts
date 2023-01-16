
import BaseFormModel from "@/forms/BaseFormModel"

export default class FormSimulation extends BaseFormModel {

  retirementDate: string = ''
  simulationId: string = null
  clientId: string = null
  name: string = ''
  email: string = ''
  phone: string = ''
  birthDate: string = ''
  motherName: string = ''
  cpf: string = ''
  nit: string = ''
  gender: string = null
  acceptTerms: boolean = false

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
      // {
      //   item: 'acceptTerms',
      //   validator: 'booleanShouldBeTrueValidation'
      // },
    ]
  }

}