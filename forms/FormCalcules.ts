
import BaseFormModel from "@/forms/BaseFormModel"

export default class FormCalcules extends BaseFormModel {

  majorContributionsPercentage: number = 100
  initialDate: string | null = null
  endDate: string | null = null

  constructor(data) {
    super()
    this.setFillableKeys(data)
  }

  get fillable() {
    return [
      'majorContributionsPercentage',
      'initialDate',
      'endDate'
    ]
  }

  get requireds(): any[] {
    return [
      {
        item: 'majorContributionsPercentage',
        validator: 'notEmpty'
      },
      {
        item: 'initialDate',
        validator: ['minLength:10', 'dateIsValid']
      },
      {
        item: 'endDate',
        validator: ['minLength:10', 'dateIsValid']
      },
    ]
  }

}