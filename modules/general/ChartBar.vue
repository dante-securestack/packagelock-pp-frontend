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
        },
        scales: {
          xAxis:{
            grid: {
              display: false
            }
          },
          yAxis:{
            grid: {
              borderDash: [4, 6],
              color: '#e4e4e7'
            }
          }
        }
      }
    })
  }

</script>


