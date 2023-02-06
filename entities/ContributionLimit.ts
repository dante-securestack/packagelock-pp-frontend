import BaseModel from '@/entities/BaseModel'

export default class ContributionLimit extends BaseModel {
  
  key: number | null = null
  id: string | null = null
  monthReference: string = ''
  contributionLimit: number = 0
  contributionMinimum: number = 0
  createdAt: string = ''
  updatedAt: string = ''

  constructor(attributes = {}) {
		super()
		this.setFillableKeys(this, ContributionLimit.fillable, attributes)
	}

	public static fillable =  [
    'key',
    'id',
    'monthReference',
    'contributionLimit',
    'contributionMinimum',
    'createdAt',
    'updatedAt',
  ]

}