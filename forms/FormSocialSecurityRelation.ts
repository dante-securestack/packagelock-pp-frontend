
import BaseFormModel from "@/forms/BaseFormModel"

export default class FormSocialSecurityRelation extends BaseFormModel {

  id: string = null
  simulationId: string = null
  nit: string = ''
  relationDocument: string = ''
  relationOrigin: string = ''
  relationType: string = ''
  startAt: string = ''
  endAt: string = ''
  lastPaymentAt: string = ''
  isIgnored: boolean = false
  ignoredReason: string = ''
  specialTime: number = 1

  constructor(data) {
    super()
    this.setFillableKeys(data)
  }

  get fillable() {
    return [
      'id',
      'simulationId',
      'nit',
      'relationDocument',
      'relationOrigin',
      'relationType',
      'startAt',
      'endAt',
      'lastPaymentAt',
      'isIgnored',
      'ignoredReason',
      'specialTime',
    ]
  }

  get requireds(): any[] {
    return [
      {
        item: 'relationOrigin'
      },
      {
        item: 'relationType'
      },
      {
        item: 'startAt',
        validator: ['minLength:10', 'dateIsValid']
      },
      {
        item: 'endAt',
        validator: ['minLength:10', 'dateIsValid']
      },
    ]
  }

}