<template>
  <div class="about">

    <div class="chart-container" style="width: 48%; height: 400px; float: left; margin-right: 2%;">
      <p class="chart-description">需求工程师岗位学历要求</p>
      <div id="main1" style="width: 100%; height: 90%;"> </div>


    </div>
    <div class="chart-container" style="width: 48%; height: 400px; float: left;">
      <p class="chart-description">需求工程师岗位经验要求</p>
      <div id="main2" style="width: 100%; height: 90%;"> </div>


    </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

// 使用 ref 来创建两个响应式的 ECharts 实例
const myChart1 = ref(null);
const myChart2 = ref(null);

// 初始化两个 ECharts 实例的函数
function initChart1(chartDom, chartRef) {
  if (chartDom) {
    chartRef.value = echarts.init(chartDom);
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
          data: ['中专', '高中', '大专', '本科', '硕士', '博士', '不限'],
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
          data: [14, 7, 1409, 6284, 333, 6, 136],
          label: {
            show: true,
            position: 'top',
            valueAnimation: true,
            formatter: '{c}'
          }
        }
      ]
    };
    chartRef.value.setOption(option);
  }
}
function initChart2(chartDom, chartRef) {
  if (chartDom) {
    chartRef.value = echarts.init(chartDom);
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
          data: ['经验不限', '1年以内', '1-3年', '3-5年', '5-10年', '10年以上'],
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
          data: [823, 40 ,1838,3591,1822,75],
          label: {
            show: true,
            position: 'top',
            valueAnimation: true,
            formatter: '{c}'
          }
        }
      ]
    };
    chartRef.value.setOption(option);
  }
}
// 在组件挂载后初始化两个 ECharts 实例
onMounted(() => {
  initChart1(document.getElementById('main1'), myChart1);
  initChart2(document.getElementById('main2'), myChart2);
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