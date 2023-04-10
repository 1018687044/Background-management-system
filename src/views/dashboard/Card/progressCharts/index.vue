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
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        type: 'category'
      },
      series: [
        {
          type: 'bar',
          data: [78],
          color: 'yellowgreen',
          barWidth: 10,
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          //   文本标签
          label: {
            show: true,
            // 改变文本内容
            formatter: '|',
            // 文本标签内容
            position: 'right'
          }
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
