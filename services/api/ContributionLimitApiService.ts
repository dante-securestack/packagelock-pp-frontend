

export default class ContributionLimitApiService {

  static getContributionLimits(): Promise<Array<any>> {
    const query = `
      {
        contributionLimits (
          order: [
            { column: "monthReference", direction: "DESC" }
          ]
        ) {
          id
          monthReference
          contributionLimit
          contributionMinimum
        }
      }
    `
    return useGraphQL({ query, caller: 'ContributionLimitApiService.getContributionLimits', shouldCache: true })
      .then(({ data }) => data.contributionLimits)
  }

}