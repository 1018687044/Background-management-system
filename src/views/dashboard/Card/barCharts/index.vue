<template>
  <div class="charts" ref="charts">
    123
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: '',
  mounted() {
    const lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'bar',
          data: [10, 7, 20, 30, 20, 22, 33],
          color: 'purple'
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {}
    })
  }
}
</script>

<style>
.charts{
    width: 100%;
    height: 100%;
}
</style>
