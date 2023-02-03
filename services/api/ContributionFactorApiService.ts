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
        if(data.contributionFactors.length) {
          return data.contributionFactors[0]
        }

        if(!getFallback) {
          console.warn('Não encontrado contributionFactors para o tipo: ', type, 'e data base:', baseMonth, '. Tentando retornar o mais recente, por favor verifique a atualização das tabelas.')
          return ContributionFactorApiService.getContributionFactorAvailableByType(contextDate, type, true)
        }

        console.warn('Não encontrado NENHUM contributionFactors para o tipo:', type, 'retornando array vazio, por favor alimente o sistema com as devidas tabelas.')

        return []
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
      return data.contributionFactors.map((contributionFactor: any) => {
        return {
          ...contributionFactor,
          monthReference: Dates.format(contributionFactor.monthReference, 'MM/yyyy')
        }
      })
    })
  }
}