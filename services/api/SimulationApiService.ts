
import Simulation from '@/entities/Simulation'
export default class SimulationApiService {

  static getSimulation(simulationId: string) {

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

    return useGraphQL({ query, caller: 'sharedSimulationStore.getSimulation' }).then(({ data }) => {
      return new Simulation(data.simulation)
    })
  }

  
}