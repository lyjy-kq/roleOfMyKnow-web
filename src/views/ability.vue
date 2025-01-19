<script setup>
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getEducationService } from '@/api/charts.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const pieChart2 = ref(null);
const errorMsg = ref(null);
const currentChart = ref(1);
// 动态设置高度
const chartContainerHeight = ref(window.innerHeight * 0.7); // 视口高度的70%

function resizeCharts() {
  chartContainerHeight.value = window.innerHeight * 0.7;
  if (pieChart2.value) pieChart2.value.resize();
}
function switchC() {
  if (currentChart.value === 2) {
    router.push('/ability'); // 路由跳转
  } else {
    router.push('/skill'); // 路由跳转
  }
}
// 获取饼状图数据 2 (应聘者职责的要求占比)
async function getPieData2() {
  try {
    const postData = {
      id: 0,
      qualification: -1,
      salary: -1,
      location: -1,
      businessNature: -1,
      field: -1,
      workExperience: -1,
      actual_salary: 0,
      sixNum: 0,
      fiveNum: -1,
    };

    const result = await getEducationService(postData);

    if (!result || !result.data) {
      throw new Error('API 返回的数据为空或者格式不正确');
    }

    const data = result.data;
    console.log(data);

    // 固定名称数组
    const names = ["工作方法", "经验", "能力", "知识", "工具", "其他"];

    // 初始化一个空数组来存放 pieData
    const pieData = names.map((name, index) => ({
      value: Number(data[index]?.result || 0), // 确保获取正确的数值，防止未定义错误
      name: name
    }));

    // 渲染饼图
    initPieChart(document.getElementById('pie2'), pieChart2, pieData);
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
      title:{
        text:"能力要求一览",
        left: "center",
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      series: [
        {
          name: '数据',
          type: 'pie',
          radius: '50%',
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

// 在组件挂载时获取数据和设置事件监听器
onMounted(async () => {
  await nextTick(); // 等待 DOM 完全挂载
  await getPieData2(); // 等待数据获取完成

  // 添加窗口大小调整监听器
  window.addEventListener('resize', resizeCharts);
});

// 在组件卸载前移除事件监听器
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts);
});
</script>

<template>
  <div class="about">
    <!-- 饼状图 -->
    <div class="chart-container">
      <el-icon></el-icon>
      <div @click="switchC" class="toggle-button" style="display: flex; align-items: center;">
        <Switch style="width: 1.5em; height: 1.5em; margin-right: 8px"></Switch>
        <span>切换到职责要求表</span>

      </div>
      <div id="pie2" class="echarts-container" :style="{ height: chartContainerHeight + 'px' }"></div>
    </div>

    <!-- 错误信息展示 -->
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
  background-color: #f9f9f9; /* 背景色 */
  padding: 20px; /* 内边距 */
}

.chart-container {
  position: relative;
  overflow: hidden;
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
