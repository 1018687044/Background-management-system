<template>
  <el-card>
    <div slot="header" style=" border-bottom:1px solid #eee ;">
      <div class="category-header">
        <span>销售额类别比</span>
        <el-radio-group v-model="radio1" size="mini">
          <el-radio-button label="全部渠道" />
          <el-radio-button label="线上" />
          <el-radio-button label="门店" />
        </el-radio-group>
      </div>
    </div>
    <div>
      <div class="charts" ref="charts" style="width: 100%;height: 300px;" />
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data() {
    return {
      radio1: []
    }
  },
  mounted() {
    const mycharts = echarts.init(this.$refs.charts)
    mycharts.setOption({
      title: {
        text: '视频',
        subtext: 1048,
        left: 'center',
        top: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside'
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    })
    // 绑定事件
    mycharts.on('mouseover', (params) => {
      const { name, value } = params.data
      mycharts.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  }
}
</script>

<style>
.category-header{
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin: 10px 0;
}

</style>
