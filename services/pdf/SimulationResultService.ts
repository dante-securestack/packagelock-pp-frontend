import BasePdfService from "./BasePdfService";
import autoTable from 'jspdf-autotable'
import { footerNoteResult, headerNoteResult } from "./texts"
import Dates from '@/services/Dates'
export default class SimulationResultService extends BasePdfService {

  simulation: any = null

  constructor(args: any) {
    super(args)
    this.simulation = args.simulation

    this.filename = `Resultado Simulação ${ this.simulation.client.name } ${ Dates.format(new Date, 'dd-MM-yyyy HH-mm-ss')}`
  }

  async addSpecificPageInfo() {

    // top line
    this.doc.setDrawColor(this.colors.zinc300)
    this.doc.setLineWidth(.5)
    this.doc.line(this.xLeft, this.yTop + 25, this.xRight, this.yTop + 25)

    // bottom line
    this.doc.setDrawColor(this.colors.zinc300)
    this.doc.setLineWidth(.5)
    this.doc.line(this.xLeft, this.yBottom, this.xRight, this.yBottom) 

    // generated at
    this.doc.setFont('Lato-Bold')
    this.doc.setFontSize(8)
    this.doc.setTextColor(this.colors.zinc600)
    await this.doc.text(`Identificador simulação: ${ this.simulation.id }`, this.xLeft, this.pageHeight - 18, { align: 'left' } )
    await this.doc.text(`Data da realização da simulação dos cálculos previdenciários: ${ this.simulation.updatedAt }`, this.xLeft, this.pageHeight - 10, { align: 'left' } )
  
    this.addHeaderAndFooterNotes()
  }

  async addHeaderAndFooterNotes() {
    this.doc.setFont('Lato-Bold')
    this.doc.setFontSize(8)
    this.doc.setTextColor(this.colors.zinc600)

    await this.doc.text(headerNoteResult, this.margins.left, this.yTop + 5, { align: 'left' } )
    await this.doc.text(footerNoteResult, this.margins.left, this.yBottom + 5, { align: 'left' } )

  }

  addLink() {        
    this.doc.setFont('Lato-Bold')
    this.doc.setTextColor(this.colors.cyan700)
    this.doc.setFontSize(9)
    this.doc.textWithLink( 
      'calculoeprevidencia.com', 
      this.xRight,
      this.pageHeight - 20,
      { 
        url: 'https://calculoeprevidencia.com/simulacao/' + this.simulation.id, 
        align: 'right',
      } 
    )
  }

  generateTables() {

    this.simulation.simulationRetirementGroups.forEach((simulationRetirementGroup: any) => {
      simulationRetirementGroup.simulationRetirementOptions.forEach((simulationRetirementOption: any) => {
        this.generateTable(simulationRetirementGroup.retirementGroup, simulationRetirementOption)
      })
    })
  }


  generateTable(retirementGroup: any, simulationRetirementOption: any) {

    const head = this.getTableHead(retirementGroup, simulationRetirementOption)
    const body = [[]]

    autoTable(this.doc, {
      theme: 'plain',
      body,
      head,
      pageBreak: 'avoid',
      styles: {
        font: 'Lato-Regular',
        fontSize: 9,
      },
      columnStyles: {
        0: {cellWidth: 220},
        1: {cellWidth: 220},
      },
      margin: { ...this.margins, top: this.margins.top + 30 }
    })
  }


  getTableHead(retirementGroup: any, simulationRetirementOption: any) {

    const headers = [

      [
        this.getTableHeaderRowItemHead('Regra', 2),
      ],
      [
        this.getTableHeaderRowItemContent(retirementGroup.title, 2, 16),
      ],
      [
        this.getTableHeaderRowItemHead(`Modalidade de aposentadoria`),
        this.getTableHeaderRowItemHead('Resultado'),
      ],
      [
        this.getTableHeaderRowItemContent(simulationRetirementOption.retirementOption.title, 1, 12),
        this.getTableHeaderRowItemContent(simulationRetirementOption.isGranted ? 'Direito ao Benefício' : 'Não tem direito ao benefício', 1, 12)
      ],
      [
        this.getTableHeaderRowItemHead('Data base'),
        this.getTableHeaderRowItemHead('Quantidade de contribuições')
      ],
      [
        this.getTableHeaderRowItemContent(simulationRetirementOption.contextDate),
        this.getTableHeaderRowItemContent(simulationRetirementOption.contributionsTotal),
      ],
      [
        this.getTableHeaderRowItemHead('Idade'),
        this.getTableHeaderRowItemHead('Tempo de contribuição')
      ],
      [
        this.getTableHeaderRowItemContent(simulationRetirementOption.age.time.timeText),
        this.getTableHeaderRowItemContent(simulationRetirementOption.contributionTime.time.timeText),
      ]
    ]

    if(this.simulation.getProjectedRetirementDate(simulationRetirementOption) && this.simulation.getProjectedRetirementDateIsAfterToday(simulationRetirementOption)) {
      headers.push(
        [
          this.getTableHeaderRowItemHead('Projeção', 2),
        ],
        [
          this.getTableHeaderRowItemContent(`Em havendo continuidade das contribuições, a aposentadoria nesta modalidade será cumprida em ${ Dates.format(simulationRetirementOption.projectedRetirementDate, 'dd/MM/yyyy') }.`, 2),
        ]
      )
    }

    return headers
  }

  getTableHeaderRowItemHead(content: string, colSpan: number = 1, fontSize: number = 10) {
    return {
      content,
      colSpan,
      styles: {
        fontSize,
        font: 'Lato-Bold',
        textColor: '#ADADAD',
        cellPadding:{
          top: 2,
          bottom: 0,
          left: 3
        }
      }
    }
  }

  getTableHeaderRowItemContent(content: string, colSpan: number = 1, fontSize: number = 10) {
    return {
      content,
      colSpan,
      styles: {
        fontSize,
        font: 'Lato-Regular',
        cellPadding:{
          top: 2,
          bottom: 2,
          left: 3
        }
      },
    }
  }


  getTableBody() {

    let bodyRows = []
    for(let i = 0; i< 10; i++) {
      bodyRows.push([`Some row ${ i }`, 'asdasd'])
    }

    return bodyRows
  }


}