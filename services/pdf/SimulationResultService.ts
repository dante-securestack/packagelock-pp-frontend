import BasePdfService from "./BasePdfService";
import autoTable from 'jspdf-autotable'
import { footerNoteResult, headerNoteResult } from "./texts"

export default class SimulationResultService extends BasePdfService {

  simulation: any = null

  constructor(args: any) {
    super(args)
    this.simulation = args.simulation

    console.log(this.simulation)
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


  generateTable() {

    const head = this.getTableHead()
    const body = this.getTableBody()

    autoTable(this.doc, {
      theme: 'plain',
      body,
      head, 
      styles: {
        font: 'Lato-Regular',
        fontSize: 9,
      },
      margin: { ...this.margins, top: this.margins.top + 30 }
    })
  }


  getTableHead() {

    return [
      [
        {
          content: `Super title`,
        }
      ],
      [
        {
          content: `Title`,
        }
      ]
    ]
  }


  getTableBody() {

    let bodyRows = []
    for(let i = 0; i< 400; i++) {
      bodyRows.push([`Some row ${ i }`])
    }

    return bodyRows
  }


}