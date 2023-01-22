import { defineStore } from 'pinia'
import GraphQL from '@/util/GraphQL'
import Simulation from '@/entities/Simulation'
import Contribution from '@/entities/Contribution'
import SocialSecurityRelation from '@/entities/SocialSecurityRelation'
import Dates from '@/services/Dates'
import { ArrayHelpers, MathHelpers } from '@igortrindade/lazyfy'

export const useSharedSimulationStore = defineStore('sharedSimulationStore', {

  state: () => ({
    simulation: new Simulation(),
    simulationIsReady: false,
    includedContributions: [] as Array<Contribution>,
    excludedContributions: [] as Array<Contribution>,
    majorContributionsPercentage: 80 as string | number,
    majorContributionsQuantity: 180,
    initialDate: null as string | null,
    endDate: null as string | null,
    valueKey: 'monetaryCorrectionFinalValue' as 'monetaryCorrectionFinalValue' | 'finalValue',
    valueKeyIndex: 'monetaryCorrectionIndexValue' as 'monetaryCorrectionIndexValue' | 'contributionFactorValue',
    includedContributionsTotal: 0,
    includedContributionsAvg: 0,
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
    setInitialDate(initialDate: string | null) {
      this.initialDate = initialDate
    },
    setEndDate(endDate: string | null) {
      this.endDate = endDate
    },
    setValueKey(valueKey: 'monetaryCorrectionFinalValue' | 'finalValue') {
      this.valueKey = valueKey
    },
    setValueKeyIndex(valueKeyIndex: 'monetaryCorrectionIndexValue' | 'contributionFactorValue') {
      this.valueKeyIndex = valueKeyIndex
    },

    processCalcules() {
      const source = this.getterFilteredContributions
      this.includedContributions = source.slice(0, Math.round(source.length * (this.majorContributionsPercentage / 100)))
      this.majorContributionsQuantity = this.includedContributions.length
      this.excludedContributions = source.slice(Math.round(source.length * (this.majorContributionsPercentage / 100)))
      this.includedContributionsTotal = this.includedContributions.reduce((acc, contribution) => acc + contribution[this.valueKey], 0)
      this.includedContributionsAvg = this.includedContributionsTotal / this.includedContributions.length
    },

    getSimulation(simulationId: string) {

      const query = `
        {

          simulation ( 
            where: [
              { column: "id", value: "${ simulationId }" }
            ]
          ) {
            id
            retirementDate
            isPendingUpdate
            customInitialDate
            customRetirementFactor
            customContributionsPercentage
            updatedAt
            client {
              id
              name
              motherName
              email
              phone
              cpf
              nit
              gender
              birthDate
            }
            simulationRetirementGroups  {
              id
              retirementGroup {
                id
                title
                description
                order
                isPreReform
              }
              simulationRetirementOptions {
                id
                isGranted
                contextDate
                age
                contributionTime
                contributionsTotal
                requirements
                projectedRetirementDate
                metaData
                retirementOption {
                  id
                  title
                  description
                  order
                  showForNotLoggedUsers
                  rule
                }
              }
            }
            socialSecurityRelations {
              id
              simulationId
              seqNumber
              nit
              relationDocument
              relationOrigin
              relationType
              startAt
              endAt
              specialTime
              lastPaymentAt
              indicators
              history
              isIgnored
              ignoredReason
              contributionTime
              contributions (
                order: [
                  { column: "key" }
                ]
              ) {
                key
                id
                socialSecurityRelationId
                monthReference
                baseValue
                valueAfterCheckLimit
                valueAfterCorrection
                finalValue
                contributionFactorValue
                isIgnored
                ignoredReason
                groupedContributionsQuantity
                history
                monetaryCorrectionIndexValue
                monetaryCorrectionSelicValue
                monetaryCorrectionFinalValue
              }
            }
          }
        }
      
      `

      GraphQL({ query, caller: 'sharedSimulationStore.getSimulation' }).then(({ data }) => {
        this.simulation = new Simulation(data.simulation)
        this.orderSimulationItems()
        this.processCalcules()
      })
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
    }
  }

})