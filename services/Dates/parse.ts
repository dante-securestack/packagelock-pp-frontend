import { parse } from 'date-fns'
import { regexYearMonthAndDay, regexMonthAndYear, regexDayMonthAndYear, regexHoursMinutesSeconds } from './customRegex'

const getNewDate = (d) => {
  let date = new Date(d)
  date.setHours(date.getHours() + 3)
  return date
}

export default (date: string | any) => {

  if(!date) return null
  
  if(date instanceof Date) {
    return date
  }

  // Timestamp
  if(typeof(date) === 'number') {
    return getNewDate(date)
  }
  
  // YYYY-MM-DD
  if(regexYearMonthAndDay.test(date)) {
    return getNewDate(date)
  }
  //MM/YYYY
  if(regexMonthAndYear.test(date)) {
    let string = `MM/yyyy`
    if(regexHoursMinutesSeconds.test(date)) string += ` HH:mm:ss`
    return parse(date, string, new Date())
  }
  //DD/MM/YYYY
  if(regexDayMonthAndYear.test(date)) {
    let string = `dd/MM/yyyy`
    if(regexHoursMinutesSeconds.test(date)) string += ` HH:mm:ss`
    return parse(date, string, new Date())
  }

  throw new Error(`Date format not recognized: ${date}`)

}