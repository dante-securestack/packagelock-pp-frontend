import dayjs from 'dayjs'

dayjs.locale('pt-br')
export default [
  //Today
  {
      label: `Hoje (${dayjs().startOf('day').format('dddd')})`,
      init: dayjs().startOf('day').format('DD/MM/YYYY'),
      end: dayjs().add(1, 'days').format('DD/MM/YYYY'),
      compairLabel: `Last ${dayjs().subtract(7, 'days').format('dddd')}`,
      compairInit: dayjs().subtract(7, 'days').startOf('day').format('DD/MM/YYYY'),
      compairEnd: dayjs().subtract(6, 'days').startOf('day').format('DD/MM/YYYY'),
  },
  //Yerterday
  {
      label: `Ontem (${dayjs().subtract(1, 'days').format('dddd')})`,
      init: dayjs().subtract(1, 'days').format('DD/MM/YYYY'),
      end: dayjs().format('DD/MM/YYYY'),
      compairLabel: `Last ${dayjs().subtract(8, 'days').format('dddd')}`,
      compairInit: dayjs().subtract(8, 'days').startOf('day').format('DD/MM/YYYY'),
      compairEnd: dayjs().subtract(7, 'days').startOf('day').format('DD/MM/YYYY'),
  },
  //Before yesterday
  {
    label: dayjs().subtract(2, 'days').format('dddd'),
    init: dayjs().subtract(2, 'days').format('DD/MM/YYYY'),
    end: dayjs().subtract(1, 'days').format('DD/MM/YYYY'),
    compairLabel: `Última ${dayjs().subtract(9, 'days').format('dddd')}`,
    compairInit: dayjs().subtract(9, 'days').startOf('day').format('DD/MM/YYYY'),
    compairEnd: dayjs().subtract(8, 'days').startOf('day').format('DD/MM/YYYY'),
  },
  //This week
  {
    label: `Esta semana`,
    init: dayjs().startOf('week').format('DD/MM/YYYY'),
    end: dayjs().endOf('week').add(2, 'days').format('DD/MM/YYYY'),
    compairLabel: `Last week`,
    compairInit: dayjs().subtract(7, 'days').startOf('week').add(1, 'days').format('DD/MM/YYYY'),
    compairEnd: dayjs().subtract(7, 'days').endOf('week').add(2, 'days').format('DD/MM/YYYY'),
  },
  // Last week
  {
    label: `Última semana`,
    init: dayjs().subtract(7, 'days').startOf('week').format('DD/MM/YYYY'),
    end: dayjs().subtract(7, 'days').endOf('week').add(2, 'days').format('DD/MM/YYYY'),
    compairLabel: `-7 days`,
    compairInit: dayjs().subtract(2, 'weeks').startOf('week').add(1, 'days').format('DD/MM/YYYY'),
    compairEnd: dayjs().subtract(2, 'weeks').endOf('week').add(2, 'days').format('DD/MM/YYYY'),
  },
  //This month
  {
    label: 'Este mês',
    init: dayjs().startOf('month').format('DD/MM/YYYY'),
    end: dayjs().endOf('month').add(1, 'days').format('DD/MM/YYYY'),
    compairLabel: `${dayjs().subtract(1, 'month').startOf('month').format('MMMM')}`,
    compairInit: dayjs().subtract(1, 'month').startOf('month').format('DD/MM/YYYY'),
    compairEnd: dayjs().subtract(1, 'month').endOf('month').format('DD/MM/YYYY'),
  },
  //Last month
  {
    label: `Mês ${dayjs().subtract(1, 'month').format('MM')}`,
    init: dayjs().subtract(1, 'month').startOf('month').format('DD/MM/YYYY'),
    end: dayjs().subtract(1, 'month').endOf('month').add(1, 'days').format('DD/MM/YYYY'),
    compairLabel: `${dayjs().subtract(2, 'month').startOf('month').format('MMMM')}`,
    compairInit: dayjs().subtract(2, 'month').startOf('month').format('DD/MM/YYYY'),
    compairEnd: dayjs().subtract(2, 'month').endOf('month').format('DD/MM/YYYY'),
  },
  //Before last month
  {
    label: `Mês ${dayjs().subtract(2, 'month').format('MM')}`,
    init: dayjs().subtract(2, 'month').startOf('month').format('DD/MM/YYYY'),
    end: dayjs().subtract(2, 'month').endOf('month').add(1, 'days').format('DD/MM/YYYY'),
    compairLabel: `${dayjs().subtract(3, 'month').startOf('month').format('MMMM')}`,
    compairInit: dayjs().subtract(3, 'month').startOf('month').format('DD/MM/YYYY'),
    compairEnd: dayjs().subtract(3, 'month').endOf('month').format('DD/MM/YYYY'),
  },
  // This year
  {
    label: `Este ano (${dayjs().format('YYYY')})`,
    init: dayjs().startOf('year').format('DD/MM/YYYY'),
    end: dayjs().endOf('year').add(1, 'days').format('DD/MM/YYYY'),
    compairLabel: `${dayjs().subtract(1, 'year').format('YYYY')}`,
    compairInit: dayjs().subtract(1, 'year').startOf('year').format('DD/MM/YYYY'),
    compairEnd: dayjs().subtract(1, 'year').endOf('year').format('DD/MM/YYYY'),
  },
  // Last year
  {
    label: `Último ano ${ dayjs().subtract(1, 'year').format('YYYY')}`,
    init: dayjs().subtract(1, 'year').startOf('year').format('DD/MM/YYYY'),
    end: dayjs().subtract(1, 'year').endOf('year').add(1, 'days').format('DD/MM/YYYY'),
    compairLabel: `${dayjs().subtract(2, 'year').format('YYYY')}`,
    compairInit: dayjs().subtract(2, 'year').startOf('year').format('DD/MM/YYYY'),
    compairEnd: dayjs().subtract(2, 'year').endOf('year').format('DD/MM/YYYY'),
  },
]
