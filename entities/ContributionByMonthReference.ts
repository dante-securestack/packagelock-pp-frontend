import Contribution from "@/entities/Contribution"

export default class ContributionByMonthReference {

  monthReference: string = ''
  baseValue: number = 0 // Valor salario do cnis
  paidAt: string = '' // Data pagamento quando disponível no cnis
  valueAfterCheckLimit: number = 0 // Valor apos aplicação da regra do teto
  limitValue: string | number = 0 // Valor do teto
  contributionFactorValue: number = 0
  valueAfterCorrection: number = 0 // Valor apos a correção
  finalValue: number = 0 // Valor final

  indicators: Array<string> = []
  
  indexCorrection: string | number = 0 // Indice utilizado da correção
  
  startAt: string = ''
  endAt: string = ''
  timeInfo: any = null
  cumulativeTimeInfo: any = null
  ageOnTimeInfo: any = null
  
  isIgnored: boolean = false // Caso o usuario selecione para ignorar
  ignoredReason: string = ''
  contributionLimit: any
  contributionFactor: any
  
  isMoreThanLimit: boolean = false // Se o valor excedeu o teto setar como true
  isLessThanMinimum: boolean = false // Se o valor for menor que o mínimo
  isBeforeJuly1994: boolean = false // Se for antes do plano real
  isAfterReform2019: boolean = false // Se for após reforma
  isMajor80ThanPercent: boolean = false // Se for entrar nos 80%

  contributions: Array<Contribution> = []
  contributionFactorId: string | null = null
  history: Array<any> = []

  relationOrigin: string = ''

}