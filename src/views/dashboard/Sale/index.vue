<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!-- 头部左侧内容 -->
      <!-- v-model="activeName" @tab-click="handleClick" -->
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!--       v-model="value1" -->
        <el-date-picker v-model="date" value-format="yyyy-MM-dd" size="mini" style="width: 250px;margin: 0 20px;" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
      </div>
    </div>
    <div>
      <el-row>
        <el-col :span="16">
          <div ref="charts" class="charts" style="height: 300px;width: 100%;" />
        </el-col>
        <el-col :span="8" class="right">
          <h3>门店{{ title }}排名</h3>
          <ul>
            <li>
              <span class="rindex">1</span>
              <span>肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span>肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span>4</span>
              <span>肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span>5</span>
              <span>肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span>6</span>
              <span>肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span>7</span>
              <span>肯德基</span>
              <span class="rvalue">12345</span>
            </li>

          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
export default {
  name: '',
  data() {
    return {
      activeName: 'sale',
      mycharts: null,
      date: []
    }
  },
  computed: {
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    }
  },
  watch: {
    title() {
      this.mycharts.setOption({
        title: {
          text: this.title + '趋势'
        }
      })
    }
  },
  mounted() {
    this.mycharts = echarts.init(this.$refs.charts)
    this.mycharts.setOption({
      title: {
        text: this.title + '趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220, 10, 52, 200, 334, 390]
        }
      ]
    })
  },
  methods: {
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setMonth() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }

}
</script>

<style scoped>
.el-card__header{
    border-bottom: none;
}
.clearfix{
    display: flex;
    justify-content: space-between;
    position: relative;
}
.tab{
    width: 100%;
}
.right{
    position: absolute;
    right: 0;
}
.right span{
    margin: 0 10px;
}
ul{
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li{
  height: 8%;
  list-style: none;
  margin: 10px 0;
}
.rindex{
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background:black ;
  color: white;
  text-align: center;
}
.rvalue{
  float: right;
}
</style>
