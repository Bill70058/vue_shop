<template>
  <div id="main"
       style="width: 900px;height:600px;"></div>
</template>

<script>
import _ from 'lodash'
import echarts from 'echarts'
export default {
  data () {
    return {}
  },
  mounted: async function () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    var options = {
      title: {
        text: '用户来源'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#E9EEF3'
          }
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
          boundaryGap: false
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ]
    }
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    const result = _.merge(res.data, options)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  }
}
</script>

<style lang="less" scoped>
</style>
