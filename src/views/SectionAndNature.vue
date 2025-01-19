<template>
  <div class="about">
    <div class="chart-container" style="width: 100%; height: 800px; margin-top: 50px">
      <el-button type="success" round @click="changeChart">切换视图</el-button>
      <div id="main" style="width: 100%; height: 90%;"></div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, nextTick} from 'vue';
import * as echarts from 'echarts';
import {getSectionService} from '@/api/charts.js';
import {getNatureService} from '@/api/charts.js';

const myChart = ref(null);
const chartData1 = ref([]);
const chartData2 = ref([]);
const xAxisData1 = ref([]);
const xAxisData2 = ref([]);
const currentChartType = ref('section');

function initChart(chartDom, chartData, xAxisData) {
  const chartRef = echarts.init(chartDom);

  const option = {
    title: {
      text: currentChartType.value === 'section' ? '招聘公司所属领域' : '招聘公司企业性质',
      left: 'center',
      top: '20px',
      textStyle: {
        fontSize: 16,
        color: '#666'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return `${params.name}: ${params.value}`;
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
        data: xAxisData,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          // 添加此配置以斜着显示标签
          rotate: 45, // 设置旋转角度，可以根据需要调整
          interval: 0 // 如果有必要，设置标签的显示间隔，0 表示全部显示
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

  // 根据 currentChartType 设置不同的 x 轴数据
  if (currentChartType.value === 'section') {
    option.xAxis[0].data = xAxisData1.value;
  } else {
    option.xAxis[0].data = xAxisData2.value;
  }

  chartRef.setOption(option);
  return chartRef;
}

// 获取招聘公司性质分类数据
async function getSections() {
  let result = await getSectionService();
  console.log(result)
  const {data}=result;
  console.log(data)
  const trueData = data.data;
  console.log(trueData)
  console.log(typeof trueData)
  let Rdata;
  if (trueData && typeof trueData === 'string') {
    Rdata = JSON.parse(trueData);
  } else {
    Rdata = []; // 或者其他默认值
  }
  console.log(Rdata)
  chartData1.value = Rdata.map(item => item.y);
  xAxisData1.value = Rdata.map(item => item.x);
  console.log(chartData1.value)
}

// 获取招聘公司领域分类数据
async function getNatures() {
  let result = await getNatureService();
  console.log(result)
  const {data}=result;
  console.log(data)
  const trueData = data.data;
  console.log(trueData)
  const Rdata = JSON.parse(trueData);
  console.log(Rdata)
  chartData2.value = Rdata.map(item => item.y);
  xAxisData2.value = Rdata.map(item => item.x);
  console.log(chartData2.value)
}

// 切换图表类型
function changeChart() {
  if (currentChartType.value === 'section') {
    currentChartType.value = 'nature';
  } else {
    currentChartType.value = 'section';
  }
  myChart.value.setOption({
    title: {
      text: currentChartType.value === 'section' ? '招聘公司所属领域' : '招聘公司企业性质',
    },
    xAxis: {
      data: currentChartType.value === 'section' ? xAxisData1.value : xAxisData2.value,
    },
    series: [
      {
        data: currentChartType.value === 'section' ? chartData1.value : chartData2.value
      }
    ]
  });
}

// 在组件挂载后初始化 ECharts 实例
onMounted(async () => {
  await getSections();
  await getNatures();
  myChart.value = initChart(document.getElementById('main'), chartData1.value, xAxisData1.value);
});
</script>

<style>
.chart-container {
  position: relative;
  overflow: hidden;
  height: 700px;
}

@media (max-width: 1000px) {
  .chart-container {
    width: 100%;
    float: none;
    margin-right: 0;
    margin-bottom: 20px;
  }
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -50px;
  }
}
</style>