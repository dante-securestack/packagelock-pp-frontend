import BaseModel from '@/entities/BaseModel'

export default class LifeExpectation extends BaseModel {
  
  key: number | null = null
  id: string | null = null
  age: string = ''
  yearReference: string = ''
  male: string = ''
  female: string = ''
  createdAt: string = ''
  updatedAt: string = ''

  constructor(attributes = {}) {
		super()
		this.setFillableKeys(this, LifeExpectation.fillable, attributes)
	}

	public static fillable =  [
    'key',
    'id',
    'age',
    'yearReference',
    'male',
    'female',
    'createdAt',
    'updatedAt',
  ]

}