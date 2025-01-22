<script setup>
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getEducationService } from '@/api/charts.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const pieChart1 = ref(null);
const errorMsg = ref(null);

const currentChart = ref(1);
const chartContainerHeight = ref(window.innerHeight * 0.7);

function resizeCharts() {
  chartContainerHeight.value = window.innerHeight * 0.7;
  if (pieChart1.value) pieChart1.value.resize();
}

// Fetch pie chart data
async function getPieData1() {
  try {
    const postData = {
      id: 0,
      qualification: -1,
      salary: -1,
      location: -1,
      businessNature: -1,
      field: 0,
      workExperience: -1,
      actual_salary: 0,
      sixNum: -1,
      fiveNum: -1,
    };

    const result = await getEducationService(postData);

    if (!result || !result.data) {
      throw new Error('API returned empty data or incorrect format');
    }

    const data = result.data;

    const names = ['互联网IT', '金融业', '贸易/零售/物流', '公共管理', '房地产/建筑', '其他'];
    const pieData = names.map((name, index) => ({
      value: Number(data[index]?.result || 0),
      name,
    }));

    initPieChartwithClick(document.getElementById('pie1'), pieChart1, pieData);
  } catch (error) {
    errorMsg.value = 'Error fetching data: ' + error.message;
    console.error('Error fetching data:', error);
  }
}

// 切换按钮的功能
function switchC() {
  if (currentChart.value === 1) {
    router.push('/DetailCompany'); // 路由跳转
  } else {
    router.push('/company'); // 路由跳转
  }
}

// Initialize the pie chart with click
function initPieChartwithClick(chartDom, chartRef, pieData) {
  if (chartDom) {
    if (!chartRef.value) {
      chartRef.value = echarts.init(chartDom);
    }
    const option = {
      title: {
        text: '企业领域一览',
        subtext:'点击图表查看各领域企业详情',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      series: [
        {
          name: '数据',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          data: pieData,
          label: {
            show: true,
            position: 'outside', // Displays the label outside the pie chart slice
            formatter: '{b}: {d}%', // Shows the name and the percentage
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    chartRef.value.setOption(option);
    chartRef.value.on('click', function (params) {
      router.push({path: '/DetailSkill', query: {field: params.name}});
    });
  }
}


onMounted(async () => {
  await nextTick();
  await getPieData1();
  resizeCharts();
  window.addEventListener('resize', resizeCharts);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts);
});
</script>

<template>
  <div class="about">
    <div class="chart-container">
      <el-icon></el-icon>
      <div @click="switchC" class="toggle-button" style="display: flex; align-items: center;">
        <Switch style="width: 1.5em; height: 1.5em; margin-right: 8px"></Switch>
        <span>切换到企业性质表</span>

      </div>
      <div id="pie1" class="echarts-container" :style="{ height: chartContainerHeight + 'px' }"></div>
    </div>

    <p v-if="errorMsg">{{ errorMsg }}</p>
  </div>
</template>

<style scoped>
/* 设置滚动容器 */
.about {
  min-height: 100vh;
  display: flex;
  flex-direction: column; /* 列布局 */
  align-items: center; /* 水平居中 */
  background-color: transparent; /* 背景色 */
  padding: 20px; /* 内边距 */
}

.chart-container {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 90%; /* 设置容器宽度 */
  height: 750px; /* 图表容器高度 */
  background: white; /* 图表背景色 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  margin: 20px 0; /* 与其他元素的间距 */
}


.section-title {
  font-size: 24px; /* 标题字体大小 */
  margin: 20px 0; /* 标题上下间距 */
  color: #333; /* 标题颜色 */
  text-align: center; /* 标题居中 */
}

.toggle-button {
  position: absolute; /* 绝对定位 */
  top: 20px; /* 距离顶部20px */
  right: 20px; /* 距离右边20px */
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #58bb8c; /* 按钮背景色 */
  color: white; /* 按钮文字颜色 */
  border: none; /* 无边框 */
  border-radius: 5px; /* 圆角 */
  transition: background-color 0.3s; /* 过渡效果 */
  z-index: 1; /* 确保按钮在图表之上 */
}

.toggle-button:hover {
  background-color: #45a76e; /* 悬停时背景色变化 */
}

.echarts-container {
  width: 100%; /* 充满父容器宽度 */
  height: 100%; /* 充满父容器高度 */
  margin-top: 3%;
}

.summary {
  margin-top: 20px; /* 与图表的间距 */
  font-size: 18px; /* 摘要字体大小 */
  color: #444; /* 摘要颜色 */
  text-align: center; /* 摘要居中 */
  max-width: 800px; /* 最大宽度 */
}
</style>

