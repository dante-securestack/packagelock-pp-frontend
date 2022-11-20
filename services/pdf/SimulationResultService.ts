import BasePdfService from "./BasePdfService";
import autoTable from 'jspdf-autotable'
import { footerNoteResult, headerNoteResult } from "./texts"
import Dates from '@/services/Dates'
export default class SimulationResultService extends BasePdfService {

  simulation: any = null

  constructor(args: any) {
    super(args)
    this.simulation = args.simulation
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
    const body = this.getTableBody()

    autoTable(this.doc, {
      theme: 'plain',
      body,
      head, 
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
        {
          colSpan: 4,
          content: `Regra ${ retirementGroup.title }`,
          styles: {
            font: 'Lato-Regular',
            fontSize: 16,
          },
        }
      ],
      [
        {
          colSpan: 4,
          content: `${ simulationRetirementOption.retirementOption.title }`,
          styles: {
            font: 'Lato-Regular',
            fontSize: 12,
          },
        }
      ],
      [
        {
          content: 'Data base',
          styles: {
            font: 'Lato-Bold',
            textColor: '#ADADAD',
            cellPadding:{
              top: 2,
              bottom: 0,
              left: 3
            }
          }
        },
        {
          content: 'Quantidade de contribuições',
          styles: {
            font: 'Lato-Bold',
            textColor: '#ADADAD',
            cellPadding:{
              top: 2,
              bottom: 0,
              left: 3
            }
          }
        },
      ],
      [
        {
          content: `${ simulationRetirementOption.contextDate }`,
          styles: {
            font: 'Lato-Regular',
            fontSize: 10,
            cellPadding:{
              top: 0,
              bottom: 2,
              left: 3
            }
          },
        },
        {
          content: `${ simulationRetirementOption.contributionsTotal }`,
          styles: {
            font: 'Lato-Regular',
            fontSize: 10,
            cellPadding:{
              top: 0,
              bottom: 2,
              left: 3
            }
          },
        }
      ],
      [
        {
          content: 'Idade',
          styles: {
            font: 'Lato-Bold',
            textColor: '#ADADAD',
            cellPadding:{
              top: 2,
              bottom: 0,
              left: 3
            }
          }
        },
        {
          content: 'Tempo de contribuição',
          styles: {
            font: 'Lato-Bold',
            textColor: '#ADADAD',
            cellPadding:{
              top: 2,
              bottom: 0,
              left: 3
            }
          }
        },
      ],
      [
        {
          content: `${ simulationRetirementOption.age.time.timeText }`,
          styles: {
            font: 'Lato-Regular',
            fontSize: 10,
            cellPadding:{
              top: 0,
              bottom: 2,
              left: 3
            }
          },
        },
        {
          content: `${ simulationRetirementOption.contributionTime.time.timeText }`,
          styles: {
            font: 'Lato-Regular',
            fontSize: 10,
            cellPadding:{
              top: 0,
              bottom: 2,
              left: 3
            }
          },
        }
      ]
    ]


    if(this.simulation.getProjectedRetirementDate(simulationRetirementOption) && this.simulation.getProjectedRetirementDateIsAfterToday(simulationRetirementOption)) {
      headers.push(
        [
          {
            content: 'Projeção',
            colSpan: 4,
            styles: {
              font: 'Lato-Bold',
              textColor: '#ADADAD',
              cellPadding:{
                top: 2,
                bottom: 0,
                left: 3
              }
            }
          },
        ],
        [
          {
            content: `Em havendo continuidade das contribuições, a aposentadoria nesta modalidade será cumprida em ${ Dates.format(simulationRetirementOption.projectedRetirementDate, 'dd/MM/yyyy') }.`,
            colSpan: 4,
            styles: {
              font: 'Lato-Regular',
              fontSize: 10,
              cellPadding:{
                top: 0,
                bottom: 2,
                left: 3
              }
            },
          },
        ]
      )
    }

    return headers
  }


  getTableBody() {

    let bodyRows = []
    for(let i = 0; i< 10; i++) {
      bodyRows.push([`Some row ${ i }`, 'asdasd'])
    }

    return bodyRows
  }


}