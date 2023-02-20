import BaseModel from '@/entities/BaseModel'
import User from '@/entities/User'
import Client from '@/entities/Client'
import SimulationRetirementGroup from '@/entities/SimulationRetirementGroup'
import SocialSecurityRelation from '@/entities/SocialSecurityRelation'
import Dates from '@/services/Dates'
export default class Simulation extends BaseModel {
  
  key: number = null
  id: string = null
  cnisFileId: string = null
  userId: string = null
  clientId: string = null
  title: string = ''
  retirementDate: string = ''
  isPendingUpdate: boolean = false
  createdAt: string = ''
  updatedAt: string = ''
  status: string = ''
  isGranted: string = ''
  firstProjectedRetirementDate: string = ''
  hasCustomInputs = false
  customInitialDate = ''
  customRetirementFactor = 0
  customContributionsPercentage = 0

  user: User = null
  client: Client = null
  simulationRetirementGroups: SimulationRetirementGroup[] = []
  socialSecurityRelations: SocialSecurityRelation[] = []

  constructor(attributes = {}) {
		super()
		this.setFillableKeys(this, Simulation.fillable, attributes)

    this.setSimulationContributionsRelationOrigin()
	}

	public static fillable =  [
    'key',
    'id',
    'cnisFileId',
    'userId',
    'clientId',
    'title',
    'retirementDate',
    'isPendingUpdate',
    'createdAt',
    'user',
    'client',
    'simulationRetirementGroups',
    'socialSecurityRelations',
    'status',
    'isGranted',
    'firstProjectedRetirementDate',
    'createdAt',
    'updatedAt',
    'hasCustomInputs',
    'customInitialDate',
    'customRetirementFactor',
    'customContributionsPercentage',
  ]


  getProjectedRetirementDate (simulationRetirementOption) {
    if(!simulationRetirementOption.projectedRetirementDate) return false
    return Dates.format(simulationRetirementOption.projectedRetirementDate, 'dd/MM/yyyy')
  }

  getProjectedRetirementDateIsAfterToday (simulationRetirementOption) {
    if(Dates.parse(simulationRetirementOption.projectedRetirementDate) <= new Date()) return false
    return true
  }

  setSimulationContributionsRelationOrigin() {
    this.socialSecurityRelations.forEach((relation) => {
      relation.contributions.forEach((contribution) => {
        contribution.relationOrigin = relation.relationOrigin
      })
    })
  }

}