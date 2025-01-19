<script setup>
import {onMounted, ref, nextTick, onBeforeUnmount} from 'vue';
import * as echarts from 'echarts';
import {getEducationService} from "@/api/charts.js";
import {useRouter} from 'vue-router';

const router = useRouter();

const pieChart1 = ref(null);
const errorMsg = ref(null);
const currentChart = ref(2);
// 动态设置高度
const chartContainerHeight = ref(window.innerHeight * 0.7); // 视口高度的70%

function resizeCharts() {
  chartContainerHeight.value = window.innerHeight * 0.7;
  if (pieChart1.value) pieChart1.value.resize();
}

// 获取饼状图数据 1 (企业所属领域的占比)
async function getPieData1() {
  try {
    const postData = {
      id: 0,
      qualification: -1,
      salary: -1,
      location: -1,
      businessNature: 0,
      field: -1,
      workExperience: -1,
      actual_salary: -1,
      sixNum: -1,
      fiveNum: -1
    };

    const result = await getEducationService(postData);

    if (!result || !result.data) {
      throw new Error('API 返回的数据为空或者格式不正确');
    }

    const data = result.data;
    // 定义饼图名称
    const names = ["国企", "外企", "合资", "民营", "上市公司", "股份制企业", "事业单位", "其他"];

    // 使用 map 获取对应的数值
    const pieData = names.map((name, index) => ({
      value: Number(data[index]?.result || 0), // 确保获取正确的数值，防止未定义错误
      name: name
    }));

    initPieChart(document.getElementById('pie1'), pieChart1, pieData);
  } catch (error) {
    errorMsg.value = '获取数据时出错: ' + error.message;
    console.error('Error fetching data:', error);
  }
}

// 初始化饼状图
function initPieChart(chartDom, chartRef, pieData) {
  if (chartDom) {
    chartRef.value = echarts.init(chartDom);
    const option = {
      title: {
        text: '企业性质一览',
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
          radius: '60%',
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
  }
}

function switchC() {
  if (currentChart.value === 1) {
    router.push('/DetailCompany'); // 路由跳转
  } else {
    router.push('company'); // 路由跳转
  }
}

onMounted(async () => {
  await nextTick();  // 等待 DOM 完全挂载
  getPieData1();
  // 添加窗口大小调整监听器
  window.addEventListener('resize', resizeCharts);
});

onBeforeUnmount(() => {
  // 清理窗口大小调整监听器
  window.removeEventListener('resize', resizeCharts);
});
</script>

<template>
  <div className="chart-container">

    <el-icon></el-icon>
    <div @click="switchC" class="toggle-button" style="display: flex; align-items: center;">
      <Switch style="width: 1.5em; height: 1.5em; margin-right: 8px"></Switch>
      <span>切换到企业领域表</span>

    </div>

    <!-- 饼图容器 -->
    <div id="pie1" className="chart-box"></div>

    <!-- 错误信息展示 -->
    <p v-if="errorMsg" className="error-message">{{ errorMsg }}</p>
  </div>
</template>

<style scoped>
/* 主容器样式 */
.chart-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto; /* 居中显示 */
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

/* 图表标题样式 */
.chart-title {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

/* 饼图容器样式 */
.chart-box {
  width: 100%;
  height: 400px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
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

/* 错误信息样式 */
.error-message {
  text-align: center;
  color: red;
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
}
</style>
