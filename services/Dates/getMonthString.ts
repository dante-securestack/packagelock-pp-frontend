export default (month) => {
  if([1, '1', '01'].includes(month)) return 'Janeiro'
  if([2, '2', '02'].includes(month)) return 'Fevereiro'
  if([3, '3', '03'].includes(month)) return 'Março'
  if([4, '4', '04'].includes(month)) return 'Abril'
  if([5, '5', '05'].includes(month)) return 'Maio'
  if([6, '6', '06'].includes(month)) return 'Junho'
  if([7, '7', '07'].includes(month)) return 'Julho'
  if([8, '8', '08'].includes(month)) return 'Agosto'
  if([9, '9', '09'].includes(month)) return 'Setembro'
  if([10, '10', '10'].includes(month)) return 'Outubro'
  if([11, '11', '11'].includes(month)) return 'Novembro'
  if([12, '12', '12'].includes(month)) return 'Dezembro'
}