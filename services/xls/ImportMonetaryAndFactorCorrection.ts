import XLSX from "xlsx"
import Dates from '@/services/Dates'
import Api from '@/util/Api'
export default class ImportMonetaryAndFactorCorrection {

  file: any
  baseMonth: string | null = Dates.format(new Date(), 'MM/yyyy')
  sheetName: string = 'Correção monetária'

  workbook: any = null
  sheetJson: any[] = []
  isChecked: boolean = false
  isImporting: boolean = false
  result: any[] = []

  constructor() {
  }

  processFile() {
    const reader = new FileReader()
    reader.onload = (event: any) => {
      this.workbook = XLSX.read(event.target.result)
      this.parseSheet()
    }

    reader.readAsArrayBuffer(this.file)
  }

  parseSheet() {
    try {
      if(!this.workbook.Sheets[this.sheetName]) throw new Error('Planilha não encontrada')
      const Sheet = this.workbook.Sheets[this.sheetName]
      this.sheetJson = XLSX.utils.sheet_to_json(Sheet)
      this.parseItems()
    } catch (error) {
      console.log(error)
      alert('Erro ao importar arquivo. Verifique se o arquivo está no formato correto.')
    }
  }

  verifyJson() {
    this.isChecked = this.sheetJson.filter((item: any) => this.verifyItem(item)).length > 0
  }

  verifyItem(item: any) {
    const monthsFinded = Object.keys(item).filter((key) => {
      return Dates.getMonthNumber(key)
    })
    return item.Ano && monthsFinded.length === 12
  }

  parseItems() {
    if(this.sheetName === 'Correção monetária') {
      this.parseMonetaryCorrection()
    } else {
      this.parseContributionFactor()
    }
  }

  parseMonetaryCorrection () {

    this.result = this.sheetJson.reduce((acc, item: any) => {
      if(!this.verifyItem(item)) return false

      const baseMonth = Dates.format(this.baseMonth, 'yyyy-MM-dd')

      Object.keys(item).filter((key) => {
        if(Dates.getMonthNumber(key)) {

          const month = Dates.getMonthNumber(key)
          const monthReference = `${ item.Ano }-${ month }-01`
          const factor = item[key]
          acc.push({
            monthReference,
            factor,
            baseMonth,
            type: 'MONETARY_CORRECTION'
          })
        }
      })

      return acc

    }, [])
  }

  parseContributionFactor () {
    this.result = this.sheetJson.reduce((acc, item: any) => {
      const baseMonth = Dates.format(this.baseMonth, 'yyyy-MM-dd')
      const monthReference = Dates.format(new Date((item.Mês - 25568) * 86400000), 'yyyy-MM-dd')
      const factor = item.Fator
      acc.push({
        monthReference,
        factor,
        baseMonth,
        type: 'CORRECTION_FACTOR'
      })
      return acc
    }, [])
  }

  updateOrCreate() {
    this.isImporting = true

    const items = this.result.filter((item: any) => item.factor)
    return Api.post('/admin/contributionFactor/updateOrCreate', { items })
      .then((result) => {
        this.isImporting = false
        return result
      })
  }

}