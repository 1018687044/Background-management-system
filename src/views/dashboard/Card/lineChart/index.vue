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
          type: 'line',
          data: [10, 7, 20, 30, 20],
          // 拐点样式
          itemStyle: {
            opacity: 0
          },
          // 线颜色
          lineStyle: {
            color: 'purple'
          },
          // 填充
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'purple' // 0% 处的颜色
              }, {
                offset: 1, color: '#fff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
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
