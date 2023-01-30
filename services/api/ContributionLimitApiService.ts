

export default class ContributionLimitApiService {

  static getContributionLimits(): Promise<Array<any>> {
    const query = `
      {
        contributionLimits {
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