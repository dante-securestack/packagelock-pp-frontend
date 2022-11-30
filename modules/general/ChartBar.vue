<template>
  <div class="w-full">
    <div class="block">
      <canvas :id="randomId" :width="width" :height="height"></canvas>
    </div>
  </div>
</template>

<script setup>

  import Chart from '@/util/ChartJs'
  import { StringHelpers } from '@igortrindade/lazyfy'
  import { colors } from '@/util/functions/chartDefaultOptions'

  const props = defineProps({
    data: Array,
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    type: {
      type: String,
      default: 'bar'
    },
    labels: {
      default: false
    }
  })

  const randomId = ref(StringHelpers.randomString(10))

  watch(() => props.data, (newValue) => {
    setTimeout(() => {
      if(chartInstance) chartInstance.destroy()
      initChart()
    }, 300)
  })

  onMounted(() => {
    setTimeout(() => {
      initChart()
    }, 300)
  })

  let chartInstance = null

  const initChart = () => {
    if(props.type === 'bar') {
      initChartBar()
    } else if(props.type === 'bar-stacked') {
      initChartBarStacked()
    }
  }

  const initChartBar = () => {
    const ctx = document.getElementById(randomId.value).getContext('2d')
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          data: props.data,
          backgroundColor: colors,
          borderColor: colors
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })
  }

  const initChartBarStacked = () => {
    const ctx = document.getElementById(randomId.value).getContext('2d')
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: props.labels,
        datasets: props.data
      },
      options: {
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          },
        }
      }
    })
  }

</script>


