export default class Contribution {

  id: string = null
  simulationId: string = null
  contributionFactorId: string = null
  contributionLimitId: string = null
  socialSecurityRelationId: string = null
  monthReference: string = ''
  baseValue: number = 0
  valueAfterCheckLimit: number = 0
  valueAfterCorrection: number = 0
  finalValue: number = 0
  contributionFactorValue: number = 0
  contributionValue: string = ''
  contributionDate: string = ''
  indicators: string = ''
  history: Array<any> = []
  isIgnored: boolean = false
  ignoredReason: string = ''
  isMoreThanLimit: boolean = false
  isLessThanMinimum: boolean = false
  isBeforeJuly1994: boolean = false
  isAfterReform2019: boolean = false
  isMajor80ThanPercent: boolean = false
  isMissingFromCnis: boolean = false
  isCustomEdit: boolean = false
  groupedContributionsQuantity: number = 0
  createdAt: string = ''
  updatedAt: string = ''
  monetaryCorrectionIndexValue: number = 0
  monetaryCorrectionSelicValue: number = 0
  monetaryCorrectionFinalValue: number = 0
  
  typedHistory = [] as Array<any>

  contributionLimit: any = null
  contributionFactor: any = null
  
  constructor(obj = {}) {
    Object.keys(obj).map((key) => {
      if(typeof(key) !== undefined) {
        this[key] = obj[key]
      }
    })
  }

}