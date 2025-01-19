<template>

  <div class="about">

    <div class="chart-container" style="width: 100%; height: 400px; float: left; margin-right: 2%;">
      <p class="chart-description">需求工程师岗位学历要求</p>
      <div id="main1" style="width: 100%; height: 90%;"> </div>


    </div>


  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';

// 使用 ref 来创建两个响应式的 ECharts 实例
const myChart1 = ref(null);
const myChart2 = ref(null);

function getData1(){
  axios({
    url:"http://192.168.43.195:8080/getXueli",
    method:"get",

  }).then((result)=>{
    const {data}=result;
    console.log(data.data)
    const trueData=data.data;
    // 处理数据
    const chartData = trueData.map(item => item.number);
    const xAxisData = trueData.map(item => item.xueli);

    // 初始化图表
    initChart1(document.getElementById('main1'), chartData, xAxisData);

  })
}
// 初始化两个 ECharts 实例的函数
async function initChart1(chartDom, chartData, xAxisData) {
  if (chartDom) {
    const chartRef = echarts.init(chartDom);
    const option = {
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
          data: xAxisData, // 使用获取到的学历数据
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
          data: chartData,
          label: {
            show: true,
            position: 'top',
            valueAnimation: true,
            formatter: '{c}'
          }
        }
      ]
    };
    chartRef.setOption(option);
    return chartRef;
  }
}


// 在组件挂载后初始化两个 ECharts 实例
onMounted(() => {

 getData1();
  initChart1(document.getElementById('main1'), result);

});
</script>

<style>

.chart-description {
  text-align: center;
  margin-top: 10px; /* 调整与图表的间距 */
  font-size: 16px; /* 可选：调整字体大小 */
  color: #666; /* 可选：调整文字颜色 */
}

.chart-container {
  position: relative;
  overflow: hidden;

}

@media (max-width: 1000px) {
  .chart-container {
    width: 100%;
    float: none;
    margin-right: 0;
    margin-bottom: 20px;

  }
}
</style>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: row; /* 更改为列布局，以便内容垂直居中 */
    align-items: center;
    margin-top: -50px;

  }
}
</style>