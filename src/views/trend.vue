<script setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";

// 响应式变量
const lineChart = ref(null); // 折线图实例
const selectedVariables = ref([]); // 当前选择的变量
const variables = ["需求1", "需求2", "需求3", "需求4", "需求5"]; // 所有可选变量

// 模拟后端返回数据
const fetchData = async () => {
  return {
    time: ["2021-01", "2021-02", "2021-03", "2021-04", "2021-05"],
    data: {
      "需求1": [10, 15, 20, 25, 30],
      "需求2": [5, 10, 15, 20, 25],
      "需求3": [30, 25, 20, 15, 10],
      "需求4": [20, 20, 20, 20, 20],
      "需求5": [10, 5, 15, 10, 5],
    },
  };
};

// 初始化图表
function initChart(chartDom) {
  if (chartDom) {
    lineChart.value = echarts.init(chartDom);
    lineChart.value.setOption({
      title: {
        text: "职业技能趋势图",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        top: "10%",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
        max: 50,
        min: 0,
        axisLabel: {
          formatter: "{value}%",
        },
      },
      series: [],
    });
  }
}

// 更新图表
async function updateChart() {
  const chartData = await fetchData();
  const xAxisData = chartData.time;

  // 更新横坐标
  lineChart.value.setOption({
    xAxis: {
      data: xAxisData,
    },
  });

  // 更新折线数据
  const seriesData = selectedVariables.value.map((variable) => ({
    name: variable,
    type: "line",
    data: chartData.data[variable],
    smooth: true, // 折线平滑
  }));

  // 更新图例和折线数据
  lineChart.value.setOption({
    series: seriesData, // 设置当前选中的折线
    legend: {
      data: selectedVariables.value, // 设置当前选中的图例
    },
  });
}

// 点击按钮切换显示/隐藏变量
function toggleVariable(variable) {
  if (selectedVariables.value.includes(variable)) {
    // 如果已经选中，则移除变量对应的折线
    selectedVariables.value = selectedVariables.value.filter(
        (v) => v !== variable
    );
  } else {
    // 如果未选中，则添加变量对应的折线
    selectedVariables.value.push(variable);
  }

  // 更新图表：添加或移除折线
  updateChart();
}

onMounted(() => {
  initChart(document.getElementById("lineChart")); // 初始化图表
  selectedVariables.value = [variables[0]]; // 默认显示第一个变量
  updateChart(); // 初始化时更新图表
});
</script>

<template>
  <div>
    <!-- 多选按钮 -->
    <div class="variables-container">
      <button
          v-for="variable in variables"
          :key="variable"
          @click="toggleVariable(variable)"
          :class="{ active: selectedVariables.includes(variable) }"
          class="variable-button"
      >
        {{ variable }}
      </button>
    </div>

    <!-- 折线图容器 -->
    <div id="lineChart" class="chart-container"></div>
  </div>
</template>

<style>
/* 按钮容器样式 */
.variables-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
}

.variable-button {
  margin: 5px;
  padding: 8px 15px;
  border: 1px solid #007bff;
  border-radius: 5px;
  background-color: #ffffff;
  color: #007bff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.variable-button.active {
  background-color: #007bff;
  color: #ffffff;
}

.variable-button:hover {
  background-color: #0056b3;
  color: #ffffff;
}

/* 图表容器样式 */
.chart-container {
  width: 90%;
  height: 500px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
