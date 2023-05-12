import { defineStore } from 'pinia'
import Simulation from '@/entities/Simulation'
import ContributionByMonthReference from '@/entities/ContributionByMonthReference'
import Contribution from '@/entities/Contribution'
import Dates from '@/services/Dates'
import { ArrayHelpers, MathHelpers } from '@igortrindade/lazyfy'
import SimulationApiService from '@/services/api/SimulationApiService'
import ContributionFactorApiService from '@/services/api/ContributionFactorApiService'
import ContributionLimitApiService from '@/services/api/ContributionLimitApiService'
import groupContributionsByMonthReference from './groupContributionsByMonthReference'

export const useSharedSimulationStore = defineStore('sharedSimulationStore', {

  state: () => ({
    simulation: new Simulation(),
    simulationIsReady: false,
    includedContributions: [] as Array<ContributionByMonthReference>,
    excludedContributions: [] as Array<ContributionByMonthReference>,
    majorContributionsPercentage: 80 as any | number,
    majorContributionsQuantity: 180,
    retirementFactor: 1,
    initialDate: null as string | null,
    endDate: null as string | null,
    includedContributionsTotal: 0,
    includedContributionsAvg: 0,
    contributionFactorsInss: [] as Array<any>,
    contributionFactorJustica: [] as Array<any>,
    contributionLimits: [] as Array<any>,
    contributionsByMonthReference: [] as Array<ContributionByMonthReference>,
  }),

  getters: {
    getterFilteredContributions(state) {
      return state.contributionsByMonthReference.filter((contribution: any) => {
        const isAfterInitialDate = !state.initialDate || !Dates.isValid(state.initialDate) ? true : Dates.parse(contribution.monthReference) > Dates.parse(state.initialDate)
        const isBeforeEndDate = !state.endDate || !Dates.isValid(state.endDate) ? true : Dates.parse(contribution.monthReference) <= Dates.sub(Dates.parse(state.endDate), 1, 'months')
        return isAfterInitialDate && isBeforeEndDate
      }).sort((a, b) => b.finalValue - a.finalValue)
    },

    getterFilteredExcludedContributions(state) {
      return state.contributionsByMonthReference.filter((contribution: any) => {
        const isAfterInitialDate = !state.initialDate || !Dates.isValid(state.initialDate) ? true : Dates.parse(contribution.monthReference) > Dates.parse(state.initialDate)
        const isBeforeEndDate = !state.endDate || !Dates.isValid(state.endDate) ? true : Dates.parse(contribution.monthReference) <= Dates.sub(Dates.parse(state.endDate), 1, 'months')
        return !isAfterInitialDate || !isBeforeEndDate
      }).sort((a, b) => b.finalValue - a.finalValue)
    },

    getterRetirementFactor(state) {
      return state.retirementFactor >= 1 ? state.retirementFactor : 1
    }
  },

  actions: {

    setMajorContributionsPercentage(majorContributionsPercentage: number) {
      this.majorContributionsPercentage = majorContributionsPercentage
    },
    setMajorContributionsQuantity(majorContributionsQuantity: number) {
      console.log(majorContributionsQuantity)
      this.majorContributionsQuantity = majorContributionsQuantity
      this.majorContributionsPercentage = MathHelpers.getPercentageOfAmount(this.getterFilteredContributions.length, this.majorContributionsQuantity)
    },
    setRetirementFactor(retirementFactor: number = 1) {
      this.retirementFactor = retirementFactor
    },
    setInitialDate(initialDate: string | null) {
      this.initialDate = initialDate
    },
    setEndDate(endDate: string | null) {
      this.endDate = endDate
    },

    async prepareCalcules() {
      this.groupContributionsByMonthReferences()
      await this.getContributionFactors()
      await this.getContributionLimits()
      this.applyContributionCorrections()
      this.processCalcules()
    },

    async processCalcules() {
      const source = this.getterFilteredContributions
      this.includedContributions =  source.slice(0, Math.round(source.length * (this.majorContributionsPercentage / 100)))
      this.majorContributionsQuantity = this.includedContributions.length
      this.excludedContributions = source.slice(Math.round(source.length * (this.majorContributionsPercentage / 100)))
      this.includedContributionsTotal = this.includedContributions.reduce((acc, contribution) => acc + contribution.finalValue, 0)
      this.includedContributionsAvg = (this.includedContributionsTotal / this.includedContributions.length) * this.getterRetirementFactor
    },

    async getSimulation(simulationId: string) {
      this.simulation = await SimulationApiService.getSimulation(simulationId)
      await this.prepareCalcules()
    },

    updateSocialSecurityRelation(socialSecurityRelation: any) {
      const finded = ArrayHelpers.find(this.simulation.socialSecurityRelations, { id: socialSecurityRelation.id })
      if(finded) {
        Object.keys(socialSecurityRelation).map((key) => {
          finded[key] = socialSecurityRelation[key]
        })
      } else {
        this.simulation.socialSecurityRelations.push(socialSecurityRelation)
      }
      this.groupContributionsByMonthReferences()
    },

    async updateContribution(contribution: any) {
      const socialSecurityRelation = ArrayHelpers.find(this.simulation.socialSecurityRelations, { id: contribution.socialSecurityRelationId })
      const finded = ArrayHelpers.find(socialSecurityRelation.contributions, { id: contribution.id })
      if(finded) {
        Object.keys(contribution).map((key: string) => {
          finded[key] = contribution[key]
        })
      } else {
        socialSecurityRelation.contributions.push(contribution)
      }
      await this.prepareCalcules()
      this.processCalcules()
    },

    groupContributionsByMonthReferences() {
      this.contributionsByMonthReference = groupContributionsByMonthReference(this.simulation.socialSecurityRelations)
      this.simulationIsReady = true
    },

    async getContributionFactors() {
      this.contributionFactorsInss = await ContributionFactorApiService.getContributionFactors(this.simulation.retirementDate, 'CORRECTION_FACTOR')
      this.contributionFactorJustica = await ContributionFactorApiService.getContributionFactors(this.simulation.retirementDate, 'MONETARY_CORRECTION')
    },

    async getContributionLimits() {
      this.contributionLimits = await ContributionLimitApiService.getContributionLimits()
    },

    applyContributionCorrections() {
      for(const contributionByMonthReference of this.contributionsByMonthReference) {
        this.applyContributionLimit(contributionByMonthReference)
        this.applyContributionFactor(contributionByMonthReference)
      }
    },

    applyContributionLimit(contributionByMonthReference: ContributionByMonthReference) {
      
      contributionByMonthReference.finalValue = contributionByMonthReference.baseValue
      contributionByMonthReference.valueAfterCheckLimit = contributionByMonthReference.baseValue
      
      let contributionLimit = ArrayHelpers.find(this.contributionLimits, { monthReference: contributionByMonthReference.monthReference })

      if(!contributionLimit) {
        contributionLimit = this.contributionLimits[0]
      }

      contributionByMonthReference.contributionLimit = contributionLimit
      contributionByMonthReference.limitValue = contributionLimit.contributionLimit

      if(contributionLimit) {
        if(contributionByMonthReference.baseValue > contributionLimit.contributionLimit) {
          contributionByMonthReference.valueAfterCheckLimit = contributionLimit.contributionLimit
          contributionByMonthReference.finalValue = contributionLimit.contributionLimit
        }
      }

    },

    applyContributionFactor(contributionByMonthReference: ContributionByMonthReference) {

      contributionByMonthReference.valueAfterCorrection = contributionByMonthReference.finalValue

      const contributionIsBeforeJuly1994 = Boolean(Dates.parse(contributionByMonthReference.monthReference) < new Date('1994-07-01'))
      const source = contributionIsBeforeJuly1994 ? this.contributionFactorJustica : this.contributionFactorsInss

      let contributionFactor = ArrayHelpers.find(source, { monthReference: contributionByMonthReference.monthReference })
      if(!contributionFactor) {
        contributionFactor = source[0]
      }

      if(contributionFactor) {
        contributionByMonthReference.finalValue = MathHelpers.round(contributionByMonthReference.finalValue * MathHelpers.round(contributionFactor.factor, 4), 4)
        contributionByMonthReference.valueAfterCorrection = contributionByMonthReference.finalValue
        contributionByMonthReference.contributionFactorValue = contributionFactor.factor
        contributionByMonthReference.contributionFactor = contributionFactor
      }

    }

  }

})