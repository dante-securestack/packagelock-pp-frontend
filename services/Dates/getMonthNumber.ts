export default (monthName: string): string | false => {
  if (monthName.toLowerCase() === 'janeiro') {
    return '01'
  } else if (monthName.toLowerCase() === 'fevereiro') {
    return '02'
  } else if (monthName.toLowerCase() === 'março') {
    return '03'
  } else if (monthName.toLowerCase() === 'abril') {
    return '04'
  } else if (monthName.toLowerCase() === 'maio') {
    return '05'
  } else if (monthName.toLowerCase() === 'junho') {
    return '06'
  } else if (monthName.toLowerCase() === 'julho') {
    return '07'
  } else if (monthName.toLowerCase() === 'agosto') {
    return '08'
  } else if (monthName.toLowerCase() === 'setembro') {
    return '09'
  } else if (monthName.toLowerCase() === 'outubro') {
    return '10'
  } else if (monthName.toLowerCase() === 'novembro') {
    return '11'
  } else if (monthName.toLowerCase() === 'dezembro') {
    return '12'
  } else {
    return false
  }
}