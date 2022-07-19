import RetirementOption from '@/entities/RetirementOption'
import BaseModel from '@/entities/BaseModel'

export default class RetirementGroup extends BaseModel {

  key: number = null
  id: string = null
  title: string = ''
  description: string = ''
  content: string = ''
  retirementDate: string
  createdAt: string = ''
  updatedAt: string = ''

  retirementOptions: RetirementOption[] = []

  constructor(attributes = {}) {
    super()
    this.setFillableKeys(this, RetirementGroup.fillable, attributes)
  }

  public static fillable =  [
    'key',
    'id',
    'title',
    'description',
    'content',
    'retirementDate',
    'createdAt',
    'updatedAt',
    'retirementOptions'
  ]

}

