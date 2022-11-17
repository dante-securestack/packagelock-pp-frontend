/* eslint-disable no-unused-vars */
import { jsPDF } from "jspdf"
import dayjs from 'dayjs'
import imageLoader from '@/util/functions/imageLoader'
import { registerLatoBold } from '@/assets/js/fonts/Lato-Bold-normal.js'
import { registerLatoRegular } from  '@/assets/js/fonts/Lato-Regular-normal.js'
import { registerLatoLight } from  '@/assets/js/fonts/Lato-Light-normal.js'
import scaleDimensions from '@/util/functions/scaleDimensions'
import getBaseUrlImageDimensions from '@/util/functions/getBaseUrlImageDimensions'

export default class BasePdfService {

  doc: any = null

  colors = {
    white : '#FFF',
    zinc100 : '#f4f4f5',
    zinc200 : '#e4e4e7',
    zinc300 : '#d4d4d8',
    zinc400 : '#a1a1aa',
    zinc500 : '#71717a',
    zinc600 : '#52525b',
    zinc700 : '#3f3f46',
    zinc800 : '#27272a',
    zinc900 : '#18181b',
    orange600 : '#ea580c',
    amber600 : '#d97706',
    cyan900 : '#164e63'
  }

  sourceUrl: string = ''
  headline: string = 'Headline'
  title: string = 'Title'
  subtitle: string = 'Subtitle'

  margins = { 
    top: 45, 
    right: 20, 
    left: 20, 
    bottom: 35 
  }

  lastTablePage = null
  
  filename: string = ''

  pageWidth: number = 0
  pageHeight: number = 0

  constructor(args: any) {
    this.init(args)
  }

  async init(args: any) {
    
    this.doc = new jsPDF({ format: 'a4', unit: 'px', orientation: 'portrait' })
    this.filename = args.fileName
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
    this.registerCustomFonts()
  }


  registerCustomFonts() {
    registerLatoBold(this.doc)
    registerLatoRegular(this.doc)
    registerLatoLight(this.doc)
    this.doc.setFont('Lato-Regular')
  }

  async addPage() {    
    await this.addPageHeader()
    this.addPageFooter()
    this.addPageCount()
    this.doc.addPage()
  }


  async addPageGrid( { column = 20, row = 20 } = {}) {
    
    const maxWidth = this.pageWidth
    
    this.doc.setFontSize(10)
    this.doc.setDrawColor('gray')
    this.doc.setLineWidth(.3)
    
    let xPosition = 0
    while (xPosition <= maxWidth ) {      
      xPosition += column
      this.doc.line(xPosition, 0, xPosition, this.pageHeight)
      this.doc.text(`${xPosition}`, xPosition + 1 , 3, { baseline : 'top' })
    }

    let yPosition = 0
    while (yPosition <= maxWidth ) {      
      yPosition += row
      this.doc.line(0, yPosition, this.pageWidth, yPosition)
      this.doc.text(`${yPosition}`, 3 , yPosition + 1, { baseline : 'top' })
    }        

  }

  getGeneratedInfoText() {
    return `Generated ${dayjs().format('MMMM DD, YYYY')} from the Cost-Effectiveness Explorer`
  }

  addDocumentGeneratedInfo() {

    this.doc.setFont('Lato-Bold')
    this.doc.setFontSize(10)
    this.doc.setTextColor(this.colors.zinc100)
    this.doc.text(this.getGeneratedInfoText(), 30, this.pageHeight  - 102)
    
    this.doc.setFont('Lato-Regular')
    this.doc.setFontSize(10)
    this.doc.setTextColor(this.colors.cyan900)
    this.doc.textWithLink(this.sourceUrl, 30, this.pageHeight  - 90, { url: this.sourceUrl })

  }

  async addPageHeader() {
    
    this.doc.setFillColor(this.colors.cyan900);
    this.doc.rect(0, 0, this.pageWidth, this.margins.top, 'F');

    const logoExplorerBase64 = await imageLoader({ imageUrl: `/images/logo/128w/LOGO_2_1_128w.png`, returnsBase64: true })
    const { width, height } = await getBaseUrlImageDimensions(logoExplorerBase64)
    const { width: logoWidth, height: logoHeight } = scaleDimensions({ width, height, maxWidth: this.pageWidth, maxHeight : this.margins.top * 0.5 })
    const logoYPosition = (this.margins.top - logoHeight) / 2
    await this.doc.addImage(logoExplorerBase64, this.margins.left, logoYPosition, logoWidth, logoHeight, 'logo_calculo_previdencia')    

    const marginGap = 10
    const logoBorderLineXPosition = this.margins.left + logoWidth + marginGap

    const captionsXPosition = logoBorderLineXPosition + marginGap
    const captionsYPositionStart = 20
    
    this.doc.setFont('Lato-Bold')
    this.doc.setTextColor(this.colors.zinc100)
    this.doc.setFontSize(10)
    this.doc.text(this.headline, captionsXPosition, captionsYPositionStart, { baseline : 'bottom' })

    this.doc.setFont('Lato-Regular')
    this.doc.setTextColor(this.colors.zinc100)
    this.doc.setFontSize(12)
    this.doc.text(`${this.title} - ${this.subtitle}`, captionsXPosition, captionsYPositionStart + 12, { baseline : 'bottom' })
    
  }
  
  addPageFooter() {        

    this.doc.setDrawColor(this.colors.zinc400)
    this.doc.setLineWidth(.5)

    const pageSize = this.doc.internal.pageSize
    const xStartPos = this.margins.left
    const xFinalPos = pageSize.getWidth() - this.margins.right
    const yPos = pageSize.getHeight() - this.margins.bottom + 10

    this.doc.line(xStartPos, pageSize.getHeight() - this.margins.bottom + 10, xFinalPos, yPos) 
    
    this.doc.setFont('Lato-Bold')
    this.doc.setTextColor(this.colors.zinc400)
    this.doc.setFontSize(9)
    this.doc.textWithLink( 
      'calculoeprevidencia.com', 
      20,
      this.pageHeight - 10,
      { 
        url: 'https://calculoeprevidencia.com', 
        align: 'left',
        charSpace: 1 
      } 
    )

  }

  async addPageCount() {

    this.doc.setFont('Lato-Bold')
    this.doc.setFontSize(9)
    this.doc.setTextColor(this.colors.zinc400)
    
    const xPos = this.pageWidth - this.margins.right
    const yPos = this.pageHeight - 10

    console.log(this.doc.internal.getCurrentPageInfo())

    await this.doc.text(`Página ${ this.doc.internal.getCurrentPageInfo().pageNumber }`, xPos, yPos, { align: 'right' } )

  }


  async export(type = '') {    
    this.doc.save(this.filename)
  }

  getThePrintableArea() {
    const pageWidth = this.doc.internal.pageSize.getWidth()
    const pageHeight = this.doc.internal.pageSize.getHeight()

    return {
      width: pageWidth - this.getHorizontalMargins(),
      height: pageHeight - this.getVerticalMargins()
    }
  }

  getHorizontalMargins() {
    return (this.margins.left + this.margins.right)
  }
  
  getVerticalMargins() {
    return (this.margins.top + this.margins.bottom)
  }



}
