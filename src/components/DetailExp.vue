<script setup>
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getEducationService } from "@/api/charts.js";

const chartContainerHeight = ref(window.innerHeight * 0.7); // 视口高度的70%
const selectedOption = ref('薪资对比'); // 默认选择的图表类型
const selectedEducationLevel = ref('无经验'); // 默认选择的学历
const chartOptions = ["薪资对比", "技能对比", "职责要求"]; // 图表选项
const educationLevels = ["无经验", "经验不限", "1年以下", "1-3年", "3-5年", "5-10年", "10年以上"]; // 学历选项

const skillsNames = ["工作方法", "经验", "能力", "知识", "工具", "其他"];
const responsibilitiesNames = ["需求获取", "需求分析", "需求规范", "需求验证", "需求管理"];

// 保存数据
const chartData = ref({});
const errorMsg = ref(null);
const myBarChart = ref(null);

// 动态设置高度
function resizeCharts() {
  chartContainerHeight.value = window.innerHeight * 0.7;
  if (myBarChart.value) myBarChart.value.resize();
}

// 获取柱状图数据(薪资对比)
async function getBarData() {
  try {
    const postData1 = {
      id: 0,
      qualification: 0,
      salary: -1,
      location: -1,
      businessNature: -1,
      field: -1,
      workExperience: -1,
      actual_salary: 0,
      sixNum: -1,
      fiveNum: -1
    };

    const result1 = await getEducationService(postData1);
    const xAxisData = ["无经验", "经验不限", "1年以下", "1-3年", "3-5年", "5-10年", "10年以上"];
    const salaryData = result1.data.map(item => Number(item.result));

    chartData.value = { xAxisData, salaryData };

    // 初始化柱状图
    initBarChart(xAxisData, salaryData, '薪资对比');
  } catch (error) {
    errorMsg.value = '获取数据时出错: ' + error.message;
  }
}

// 初始化柱状图
function initBarChart(xAxisData, yAxisData, title) {
  const chartDom = document.getElementById('bar-chart');
  if (!chartDom) return;

  myBarChart.value = echarts.init(chartDom);

  const option = {
    title: {
      text: title,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}',
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
      max:18000
    },
    series: [
      {
        name: '数据',
        type: 'bar',
        data: yAxisData,
        label: {
          show: true,
          position: 'top',
          formatter: '{c}'
        },
      },
    ],
  };

  myBarChart.value.setOption(option);
}

// 获取饼图数据(技能对比或职责要求)
async function getPieData(category, educationIndex) {
  // 动态设置 sixNum 和 fiveNum，根据 category 的不同
  const sixNumValue = category === '技能对比' ? 0 : -1;
  const fiveNumValue = category === '职责要求' ? 0 : -1;

  // 创建动态的 postData，qualification 值根据学历索引动态生成
  const postData = {
    id: 0,
    qualification: educationIndex + 1, // qualification 从 1 到 8 对应学历索引
    salary: -1,
    location: -1,
    businessNature: -1,
    field: -1,
    workExperience: -1,
    actual_salary: -1,
    sixNum: sixNumValue,
    fiveNum: fiveNumValue
  };

  try {
    // 发送请求
    const result = await getEducationService(postData);

    // 确定使用技能对比还是职责对比的名称数组
    const names = category === '技能对比' ? skillsNames : responsibilitiesNames;

    // 处理数据，生成用于饼图的 data 数组
    const pieData = names.map((name, nameIndex) => ({
      value: Number(result?.data[nameIndex]?.result || 0),
      name: name
    }));

    // 获取饼图的 DOM 元素并初始化
    const chartDom = document.getElementById('pie-chart');
    const chartInstance = echarts.init(chartDom);

    // 配置饼图的 option
    const option = {
      title: {
        text: educationLevels[educationIndex], // 显示学历级别
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
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
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    // 设置饼图的 option
    chartInstance.setOption(option);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
  }
}

// 当选项变化时，更新图表
function updateCharts() {
  if (selectedOption.value === '薪资对比') {
    document.getElementById('bar-chart').style.display = 'block';
    document.getElementById('pie-chart').style.display = 'none';
    getBarData();
  } else {
    document.getElementById('bar-chart').style.display = 'none';
    document.getElementById('pie-chart').style.display = 'block';
    const educationIndex = educationLevels.indexOf(selectedEducationLevel.value);
    getPieData(selectedOption.value, educationIndex);
  }
}

// 生命周期钩子
onMounted(async () => {
  await nextTick();
  updateCharts();

  window.addEventListener('resize', resizeCharts);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts);
});
</script>

<template>
  <div class="scrollable-container">
    <!-- 选择框 (图表类型) -->
    <select v-model="selectedOption" @change="updateCharts" class="dropdown">
      <option v-for="option in chartOptions" :key="option" :value="option">{{ option }}</option>
    </select>

    <!-- 第二个选择框 (学历), 当 selectedOption 不是 "薪资对比" 时显示 -->
    <select v-if="selectedOption !== '薪资对比'" v-model="selectedEducationLevel" @change="updateCharts" class="dropdown">
      <option v-for="level in educationLevels" :key="level" :value="level">{{ level }}</option>
    </select>

    <!-- 柱状图容器 -->
    <div id="bar-chart" style="width: 80%; height: 600px; margin: 20px auto;"></div>

    <!-- 饼状图容器 -->
    <div id="pie-chart" style="width: 80%; height: 400px; margin: 20px auto;"></div>

    <!-- 错误信息展示 -->
    <p v-if="errorMsg">{{ errorMsg }}</p>
  </div>
</template>

<style scoped>
.scrollable-container {
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f0f2f5;
  border-radius: 8px;
}

.dropdown {
  display: block;
  margin: 0 auto 20px auto;
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  width: 200px;
}

#bar-chart, #pie-chart {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
}
</style>
