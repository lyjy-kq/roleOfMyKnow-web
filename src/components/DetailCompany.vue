<script setup>
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getEducationService } from "@/api/charts.js";
import { useRouter } from 'vue-router';

const router = useRouter();

const pieChart1 = ref(null);
const errorMsg = ref(null);
const currentChart = ref(2);
const chartContainerHeight = ref(window.innerHeight * 0.7); // 动态设置高度

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
    const names = ["国企", "外企", "合资", "民营", "上市公司", "股份制企业", "事业单位", "其他"];
    const pieData = names.map((name, index) => ({
      value: Number(data[index]?.result || 0),
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
            position: 'outside',
            formatter: '{b}: {d}%',
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
    router.push('/DetailCompany');
  } else {
    router.push('company');
  }
}

onMounted(async () => {
  await nextTick();  // 等待 DOM 完全挂载
  getPieData1();
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
      <div @click="switchC" class="toggle-button">
        <Switch style="width: 1.5em; height: 1.5em; margin-right: 8px"></Switch>
        <span>切换到企业领域表</span>
      </div>

      <!-- 饼图容器 -->
      <div id="pie1" class="chart-box"></div>

      <!-- 错误信息展示 -->
      <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<style scoped>
.about {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  padding: 20px;
}

.chart-container {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 750px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.chart-title {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.chart-box {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  padding: 0px;
}

.toggle-button {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #58bb8c;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  z-index: 1;
}

.toggle-button:hover {
  background-color: #45a76e;
}

.error-message {
  text-align: center;
  color: red;
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
}
</style>
