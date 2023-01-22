import RetirementOption from '@/entities/RetirementOption'

interface RequirementRuleInterface {
  isGranted: boolean
  content: string
}

export default class SimulationRetirementOption {
  key = 0
  id = ''
  simulationId = ''
  simulationRetirementGroupId = ''
  retirementOptionId = ''
  isGranted = ''
  requirements = ''
  contextDate = ''
  age = ''
  contributionTime = ''
  contributionsTotal = ''
  retirementDate = [] as RequirementRuleInterface[]
  createdAt = ''
  updatedAt = ''
  retirementOption = new RetirementOption()
}