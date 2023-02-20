import { ArrayHelpers } from '@igortrindade/lazyfy'
import ContributionByMonthReference from '@/entities/ContributionByMonthReference'
import SocialSecurityRelation from '@/entities/SocialSecurityRelation'
export default (socialSecurityRelations: Array<SocialSecurityRelation>): Array<ContributionByMonthReference> => {

  const contributionsByMonthReference: Array<ContributionByMonthReference> = []

  for (const socialSecurityRelation of socialSecurityRelations) {

    for (const [index, contribution] of socialSecurityRelation.contributions.entries()) {
      
      let contributionByMonthReference
      contributionByMonthReference = ArrayHelpers.find(contributionsByMonthReference, { monthReference: contribution.monthReference })

      if(!contributionByMonthReference) {
        contributionByMonthReference = new ContributionByMonthReference()
        contributionByMonthReference.monthReference = contribution.monthReference
        contributionByMonthReference.baseValue = contribution.baseValue
        contributionByMonthReference.contributions = [contribution]
        contributionsByMonthReference.push(contributionByMonthReference)
        contributionByMonthReference.relationOrigin = contribution.relationOrigin
      } else {
        contributionByMonthReference.baseValue += contribution.baseValue
        contributionByMonthReference.contributions.push(contribution)
      }

    }

  }

  return contributionsByMonthReference

}


