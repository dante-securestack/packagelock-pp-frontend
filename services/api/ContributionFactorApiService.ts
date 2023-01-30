import Dates from '@/services/Dates'



export default class ContributionFactorApiService {


  static getContributionFactorAvailableByType(contextDate: string, type: string, getFallback: boolean = false): Promise<any> {
    const baseMonth = Dates.format(contextDate, 'yyyy-MM') + '-01'
    const query = `
        {
          contributionFactors (
            where: [
              { column: "type", value: "${ type }" }
              ${ !getFallback ? `{ column: "baseMonth", operation: "lessthanorequal", value: "${baseMonth}" }` : '' }
            ]
            order: [
              { column: "baseMonth", direction: "DESC" }
            ]
            take: 1
          ) {
            id
            baseMonth
            monthReference
            factor
            type
          }
        }
      `
      return useGraphQL({ query, caller: 'AdminContributionFactorIndex.getContributionFactorAvailableByType', shouldCache: true })
      .then(({ data }) => {
        return data.contributionFactors.length ? data.contributionFactors[0] : ContributionFactorApiService.getContributionFactorAvailableByType(contextDate, type, true)
      })
  }

  static getLatestContributionFactorAvailable(contextDate: string, type = 'CORRECTION_FACTOR' as 'MONETARY_CORRECTION' | 'CORRECTION_FACTOR'): Promise<any> {
    return ContributionFactorApiService.getContributionFactorAvailableByType(contextDate, type)
  }

  static async getContributionFactors(contextDate: string, type = 'CORRECTION_FACTOR' as 'MONETARY_CORRECTION' | 'CORRECTION_FACTOR'): Promise<any> {
    
    const latest = await ContributionFactorApiService.getLatestContributionFactorAvailable(contextDate, type)
    const query = `
      {
        contributionFactors (
          where: [
            { column: "type", value: "${ type }" }
            { column: "baseMonth", value: "${Dates.format(latest.baseMonth, 'yyyy-MM-dd')}" }
          ]
          order: [
            { column: "monthReference", direction: "DESC" }
          ]
        ) {
          id
          baseMonth
          monthReference
          factor
          type
        }
      }
    `
    return useGraphQL({ query, caller: 'AdminContributionFactorIndex.getContributionFactors', shouldCache: true })
    .then(({ data }) => {
      return data.contributionFactors
    })
  }
}