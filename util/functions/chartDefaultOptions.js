import { deepMergeObject } from '@igortrindade/lazyfy'

export const colors = [
  "#518BE2",
  "#43CEC2",
  "#8CCA82",
  "#E9CF74",
  "#FF906D",
  "#FF77B8",
  "#9278C9",
  "#518BE2",
  "#43CEC2",
  "#8CCA82",
  "#E9CF74",
  "#FF906D",
  "#FF77B8",
  "#9278C9",
  "#518BE2",
  "#43CEC2",
  "#8CCA82",
  "#E9CF74",
  "#FF906D",
  "#FF77B8",
  "#9278C9",
]


export const getChartMergedOptions = (options) => {
  const chartDefaultOptions = (options.chart.type == 'donut') ? apexChartDonutsDefaultOptions : apexChartBarDefaultOptions
  return deepMergeObject(JSON.parse(JSON.stringify(chartDefaultOptions)), options)

}

export const apexChartBarDefaultOptions = {
  chart: {
    type: 'bar',
    width: '100%',
    height: '340px',
    stacked: true,
    fontFamily: 'Lato, Helvetica Neue, sans-serif',
    foreColor: '#798490',
    offsetX: 6,
    toolbar: { show: false },
    selection: { enabled: false },
    zoom: { enabled: false }
  },
  fill: { opacity: 1, },
  grid: {
    borderColor: '#D6DDE5',
    strokeDashArray: 4,
  },
  states: {
    hover: { filter: { type: 'none' } }, 
    active: { filter: { type: 'none' } },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: { 
    axisTicks: { show: false, },
    labels: {
      style: {
        colors: ['#798490'],
        fontSize: '12px',
        fontFamily: 'Lato, Helvetica Neue, sans-serif',
        fontWeight: 700,
        cssClass: 'apexcharts-xaxis-label',
      },
    }
  },
  yaxis: {
    axisBorder: {
      show: true,
      color: '#D4D8D9',
      offsetX: -1,
      offsetY: 0
    },
    labels: {
      style: {
        colors: ['#798490'],
        fontSize: '12px',
        fontFamily: 'Lato, Helvetica Neue, sans-serif',
        fontWeight: 700,
        cssClass: 'apexcharts-xaxis-label psui-text-left',
      },
      offsetX: -15,
    }
  },
  legend: {
    show: false
  },
}

export const apexChartDonutsDefaultOptions = {
  chart: {
    type: 'donut',
    height: '100%',
    fontFamily: 'Lato, Helvetica Neue, sans-serif',
    toolbar: { show: false },
    selection: { enabled: false },
    zoom: { enabled: false },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '40%',
        labels: { show: false,  }
      },      
    }
  },
  fill: { opacity: 1, },
  states: {
    hover: { filter: { type: 'none' } }, 
    active: { filter: { type: 'none' } },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false
  },
}