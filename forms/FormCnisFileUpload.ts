
import BaseFormModel from "@/forms/BaseFormModel"
import FileInfo from '@/entities/FileInfo'

export default class FormCnisFileUpload extends BaseFormModel {

  retirementDate: string = ''
  gender: string = ''
  file: FileInfo = new FileInfo()
  acceptTerms: boolean = false

  constructor(data) {
    super()
    this.setFillableKeys(data)
  }

  get fillable() {
    return [
      'retirementDate',
      'gender',
      'file',
      'acceptTerms',
      'tried'
    ]
  }

  get requireds(): any[] {
    return [
      {
        item: 'retirementDate',
        validator: ['minLength:10', 'dateIsValid']
      },
      {
        item: 'gender',
      },
      {
        item: 'file',
        validator: 'fileValidation'
      },
      {
        item: 'acceptTerms',
        validator: 'booleanShouldBeTrueValidation'
      }
    ]
  }

}