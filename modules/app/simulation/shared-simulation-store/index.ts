import { defineStore } from 'pinia'
import Simulation from '@/entities/Simulation'
import Contribution from '@/entities/Contribution'
import Dates from '@/services/Dates'
import { ArrayHelpers, MathHelpers } from '@igortrindade/lazyfy'
import SimulationApiService from '@/services/api/SimulationApiService'
import ContributionFactorApiService from '@/services/api/ContributionFactorApiService'
import ContributionLimitApiService from '@/services/api/ContributionLimitApiService'

export const useSharedSimulationStore = defineStore('sharedSimulationStore', {

  state: () => ({
    simulation: new Simulation(),
    simulationIsReady: false,
    includedContributions: [] as Array<Contribution>,
    excludedContributions: [] as Array<Contribution>,
    majorContributionsPercentage: 80 as string | number,
    majorContributionsQuantity: 180,
    retirementFactor: 1,
    initialDate: null as string | null,
    endDate: null as string | null,
    valueKey: 'monetaryCorrectionFinalValue' as 'monetaryCorrectionFinalValue' | 'finalValue',
    valueKeyIndex: 'monetaryCorrectionIndexValue' as 'monetaryCorrectionIndexValue' | 'contributionFactorValue',
    contributionFactorType: 'CORRECTION_FACTOR' as 'MONETARY_CORRECTION' | 'CORRECTION_FACTOR',
    includedContributionsTotal: 0,
    includedContributionsAvg: 0,
    contributionFactorPreform: [] as Array<any>,
    contributionFactorLifetimeReview: [] as Array<any>,
    contributionLimits: [] as Array<any>,
  }),

  getters: {
    getterMappedContributtions: (state) => {
      return state.simulation.socialSecurityRelations.reduce((acc, relation) => {
        return acc.concat(relation.contributions.map((contribution) => {
          return {
            ...contribution,
            relationOrigin: relation.relationOrigin
          }
        }))
      }, [] as Array<Contribution>).sort((a, b) => { 
        return Dates.parse(a.monthReference) - Dates.parse(b.monthReference)
      })
    },
    getterFilteredContributions() {
      return this.getterMappedContributtions.filter((contribution: any) => {
        const isAfterInitialDate = !this.initialDate || !Dates.isValid(this.initialDate) ? true : Dates.parse(contribution.monthReference) >= Dates.parse(this.initialDate)
        const isBeforeEndDate = !this.endDate || !Dates.isValid(this.endDate) ? true : Dates.parse(contribution.monthReference) <= Dates.parse(this.endDate)
        return isAfterInitialDate && isBeforeEndDate
      }).sort((a, b) => b[this.valueKey] - a[this.valueKey])
    },

    getterFilteredExcludedContributions() {
      return this.getterMappedContributtions.filter((contribution: any) => {
        const isAfterInitialDate = !this.initialDate || !Dates.isValid(this.initialDate) ? true : Dates.parse(contribution.monthReference) >= Dates.parse(this.initialDate)
        const isBeforeEndDate = !this.endDate || !Dates.isValid(this.endDate) ? true : Dates.parse(contribution.monthReference) <= Dates.parse(this.endDate)
        return !isAfterInitialDate || !isBeforeEndDate
      }).sort((a, b) => b[this.valueKey] - a[this.valueKey])
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
    setValueKey(valueKey: 'monetaryCorrectionFinalValue' | 'finalValue') {
      this.valueKey = valueKey
      this.contributionFactorType = valueKey === 'monetaryCorrectionFinalValue' ? 'MONETARY_CORRECTION' : 'CORRECTION_FACTOR'
    },
    setValueKeyIndex(valueKeyIndex: 'monetaryCorrectionIndexValue' | 'contributionFactorValue') {
      this.valueKeyIndex = valueKeyIndex
    },

    async processCalcules() {
      const source = this.getterFilteredContributions
      this.includedContributions = source.slice(0, Math.round(source.length * (this.majorContributionsPercentage / 100)))
      this.majorContributionsQuantity = this.includedContributions.length
      this.excludedContributions = source.slice(Math.round(source.length * (this.majorContributionsPercentage / 100)))
      this.includedContributionsTotal = this.includedContributions.reduce((acc, contribution) => acc + contribution[this.valueKey], 0)
      this.includedContributionsAvg = (this.includedContributionsTotal / this.includedContributions.length) * this.retirementFactor
    },

    async getSimulation(simulationId: string) {
      this.simulation = await SimulationApiService.getSimulation(simulationId)
      this.orderSimulationItems()
      await this.getContributionFactors()
      await this.getContributionLimits()
      this.applyContributionCorrections()
      this.processCalcules()
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
      this.orderSimulationItems()
    },

    updateContribution(contribution: any) {
      const socialSecurityRelation = ArrayHelpers.find(this.simulation.socialSecurityRelations, { id: contribution.socialSecurityRelationId })
      const finded = ArrayHelpers.find(socialSecurityRelation.contributions, { id: contribution.id })
      if(finded) {
        Object.keys(contribution).map((key: string) => {
          finded[key] = contribution[key]
        })
      } else {
        socialSecurityRelation.contributions.push(contribution)
        this.orderSimulationItems()
      }
    },

    orderSimulationItems() {
      
      this.simulation.simulationRetirementGroups.sort((a, b) => {
        return a.retirementGroup.order - b.retirementGroup.order
      })
  
      this.simulation.simulationRetirementGroups.forEach((simulationRetirementGroup) => {
        simulationRetirementGroup.simulationRetirementOptions.sort((a, b) => {
          return a.retirementOption.order - b.retirementOption.order
        })
      })
  
      this.simulation.simulationRetirementGroups = this.simulation.simulationRetirementGroups.sort((a, b) => {
        return a.retirementGroup.order - b.retirementGroup.order
      })

      this.simulation.socialSecurityRelations.sort((a, b) => {
        return a.seqNumber - b.seqNumber
      })

      for(const socialSecurityRelation of this.simulation.socialSecurityRelations) {
        socialSecurityRelation.contributions.sort((a, b) => {
          return Dates.parse(a.monthReference) - Dates.parse(b.monthReference)
        })
      }

      this.simulationIsReady = true
    },

    async getContributionFactors() {
      this.contributionFactorPreform = await ContributionFactorApiService.getContributionFactors(this.simulation.retirementDate, 'CORRECTION_FACTOR')
      this.contributionFactorLifetimeReview = await ContributionFactorApiService.getContributionFactors(this.simulation.retirementDate, 'MONETARY_CORRECTION')
    },

    async getContributionLimits() {
      this.contributionLimits = await ContributionLimitApiService.getContributionLimits()
    },


    applyContributionCorrections() {
      console.log('rodando')
      for(const socialSecurityRelation of this.simulation.socialSecurityRelations) {
        for(const contribution of socialSecurityRelation.contributions) {
          this.applyContributionLimit(contribution, 'preReform')
          this.applyContributionFactor(contribution, 'preReform')
          this.applyContributionLimit(contribution, 'lifetimeReview')
          this.applyContributionFactor(contribution, 'lifetimeReview')
        }
      }
    },

    applyContributionFactor(contribution: any, type = 'preReform' as 'preReform' | 'lifetimeReview') {
      const source = type === 'preReform' ? this.contributionFactorPreform : this.contributionFactorLifetimeReview
      const valueKey = type === 'preReform' ? 'finalValue' : 'monetaryCorrectionFinalValue'
      const valueKeyIndex = type === 'preReform' ? 'contributionFactorValue' : 'monetaryCorrectionIndexValue'

      let contributionFactor = ArrayHelpers.find(source, { monthReference: contribution.monthReference })
      if(!contributionFactor) {
        contributionFactor = source[0]
      }

      if(contributionFactor) {
        contribution.contributionFactor = contributionFactor
        contribution[valueKey] = contribution.baseValue * contributionFactor.factor
        contribution[valueKeyIndex] = contributionFactor.factor
        contribution.history.push(`Aplicando fator de correção: ${contributionFactor.factor} (baseado em ${contributionFactor.monthReference }): Valor atualizado: ${ contribution[valueKey] }`)
      }
    },

    applyContributionLimit(contribution: any, type = 'preReform' as 'preReform' | 'lifetimeReview') {
      let contributionLimit = ArrayHelpers.find(this.contributionLimits, { monthReference: contribution.monthReference })
      const valueKey = type === 'preReform' ? 'finalValue' : 'monetaryCorrectionFinalValue'

      if(!contributionLimit) {
        contributionLimit = this.contributionLimits[0]
      }
      if(contributionLimit) {
        contribution.contributionLimit = contributionLimit
        if(contribution[valueKey] > contributionLimit.contributionLimit) {
          contribution[valueKey] = contributionLimit.contributionLimit
          contribution.history.push(`Aplicando limite de contribuição: ${contributionLimit.contributionLimit} (baseado em ${contributionLimit.monthReference }): Valor atualizado: ${ contribution[valueKey] }`)
        }
      }
    }

  }

})