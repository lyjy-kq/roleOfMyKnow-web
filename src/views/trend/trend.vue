<script setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import {getAbilityService} from "@/api/charts.js";
import request from "@/tool/request.js";
import {useStore} from "@/stores/index.js";
// -----------const
const lineChart = ref(null); // 折线图实例
const selectedVariables = ref([]); // 当前选择的变量
const variables = ["职责","能力", "知识", "经验", "工具使用", "其他"]; // 所有可选变量
const hoverContents = {
  '能力': "强调个人在工作中所需的能力或素质。" +
      "它涵盖软技能（如沟通能力、团队合作）和硬技能（如技术能力、操作能力）。",
  '职责': "处理职位的具体工作任务、日常工作流程和职责，通常是职位本身的核心内容。",
  '知识': "涵盖职位要求的专业知识，包括行业知识、技术知识、公司内部流程等。通常是一个人完成工作的基础。",
  '经验': "专注于候选人需要具备的工作经验，通常包括从事相关岗位、行业或任务的年限以及成功完成类似任务的经历。",
  '工具使用': "关注职位所需掌握的工具、软件或设备的使用能力。强调候选人对专业工具的熟练度，以便有效执行工作任务。",
  '其他': "涵盖职位中未明确归类到其他类别的职责。这些可能是一些通用的、灵活的任务或职责，通常与工作环境中的动态需求相关。",
};
const timeSelect = ref('month')
const timeSelectOptions = [
  {
    value: 'year',
    label: '年',
  },
  {
    value: 'month',
    label: '月',
  },
]
const timeMonth = ref(["2024-07-20T05:40:59.413Z", "2024-12-20T05:41:00.177Z" ])
const timeYear = ref([ "2020-01-20T05:40:59.413Z", "2024-01-20T05:41:00.177Z"])
const chartData = ref({});
const store= useStore();
//--------functions
function extractYearMonth(timeArray) {
  const start = new Date(timeArray[0]).toISOString();
  const end = new Date(timeArray[1]).toISOString();
  // 提取年份和月份
  const startYear = start.substring(0, 4);
  const startMonth = start.substring(5, 7);
  const endYear = end.substring(0, 4);
  const endMonth = end.substring(5, 7);
  console.log("发送的数据", startYear, startMonth, endYear, endMonth)
  return {
    startYear,
    startMonth,
    endYear,
    endMonth
  };
}

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
        max: 70,
        min: 0,
        axisLabel: {
          formatter: "{value}%",
        },
      },
      series: [],
    });
  }
}

const updateChartInfo = async () => {
  const formData = new FormData();
  formData.append("selectedRole", store.selectedRole);
  if (timeSelect.value === 'year') {
    const { startYear, endYear } = extractYearMonth(timeYear.value);
    formData.append("timeType", 'year');
    formData.append("start", startYear);
    formData.append("end", endYear);
  } else {
    const { startYear, startMonth, endYear, endMonth } = extractYearMonth(timeMonth.value);

    formData.append("timeType", 'month');
    formData.append("start", `${startYear}-${startMonth}`);
    formData.append("end", `${endYear}-${endMonth}`);
  }
  const response = await getAbilityService(formData);
  let chartData2 = response.data;

// 创建一个映射表，用于将英文字段转换为中文字段
  const fieldNameMapping = {
    ability: "能力",
    experience: "经验",
    knowledge: "知识",
    others: "其他",
    use_tool: "工具使用",
    work: "职责"
  };

// 直接遍历并替换字段
  const translatedData = Object.keys(chartData2.data).reduce((acc, key) => {
    // 如果映射表中有对应的中文字段，就替换
    const newKey = fieldNameMapping[key] || key;
    acc[newKey] = chartData2.data[key];
    return acc;
  }, {});

// 更新响应式数据
  chartData.value = { ...chartData2, data: translatedData };
  console.log("chartData.value", chartData.value);

  await updateChart();
  return null;
};

async function updateChart() {
  const xAxisData = chartData.value.time;
  console.log("折线渲染这些", selectedVariables.value);

  // 获取当前图表的所有配置，保留除了 series 和 legend 外的其他配置
  const currentOption = lineChart.value.getOption();

  // 更新图表的 xAxis 数据
  currentOption.xAxis[0].data = xAxisData;
  // 更新折线数据
  currentOption.series = selectedVariables.value.map((variable) => ({
    name: variable,
    type: "line",
    data: chartData.value.data[variable],
    smooth: true,
    label: {
      show: false, // 默认不显示标签
    },
    emphasis: {
      label: {
        show: true,
        formatter: '{c}', // 显示当前点的数值
        position: 'top', // 显示位置在折线上方
      },
    },
  }));
  currentOption.legend[0].data = selectedVariables.value;

  lineChart.value.setOption(currentOption,true);
}


function toggleVariable(variable) {
  const index = selectedVariables.value.indexOf(variable);
  if (index > -1) {
    console.log("按钮删除", variable)
    selectedVariables.value.splice(index, 1);
  } else {
    console.log("按钮添加", variable)
    selectedVariables.value.push(variable);
  }
  updateChart();
}

function getHoverContent(variable) {
  return hoverContents[variable] ;
}

//--------other
onMounted(async () => {
  initChart(document.getElementById("lineChart")); // 初始化图表
  selectedVariables.value = variables;
  await updateChartInfo();
});
</script>

<template>
  <div class="about">
    <div class="chart-container">
      <el-row :gutter="20" justify="start"
              align="middle"
              style="width: 100%;margin-top: 10px;">
        <el-col :span="3"></el-col>
        <el-col :span="3">
          <el-text class="mx-1" type="info">请选择时间跨度：</el-text>
        </el-col>
        <el-col :span="2">
          <el-select v-model="timeSelect" placeholder="年">
            <el-option
                v-for="item in timeSelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="7" v-if="timeSelect === 'year'">
          <el-date-picker
               v-model="timeYear"
              type="yearrange"
              range-separator="到"
              start-placeholder="开始年份"
              end-placeholder="结束年份"
               style="width: 100%"
          />
        </el-col>
        <el-col :span="7" v-if="timeSelect === 'month'">
          <el-date-picker
              v-if="timeSelect === 'month'" v-model="timeMonth"
              type="monthrange"
              range-separator="到"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              style="width: 100%"
          />
        </el-col>
        <el-col :span="4">
          <button @click="updateChartInfo"
              class="variable-button">
            点击查看
          </button>
        </el-col>
        <el-col :span="5" >
          <button @click="updateChartInfo"
                  class="variable-button"
                  style="width: 80%;height: 50px;">
            查看需求趋势图
          </button>
        </el-col>
      </el-row>

      <el-row :gutter="20" justify="start" align="middle" style="width: 100%;">
        <el-col :span="2"></el-col>
        <el-col :span="5">
          <el-text class="mx-1" type="info">请选择想查看的职业技能：</el-text>
        </el-col>
        <el-col :span="15">
          <div  style="display: flex; justify-content: flex-start;
           align-items: center;">
            <el-tooltip v-for="variable in variables"
                        :key="variable"
                        :content="getHoverContent(variable)">
              <button @click="toggleVariable(variable)"
                      :class="{ active: selectedVariables.includes(variable) }"
                      class="variable-button">
                {{ variable }}
              </button>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
      <div id="lineChart" class="chart-container2"></div>
    </div>
  </div>
</template>

<style>
.about {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  min-height: 100vh;
  flex-direction: column; /* 列布局 */
  background-color: transparent; /* 背景色 */
  padding: 20px; /* 内边距 */
}

.chart-container {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column; /* 变更为列布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 90%; /* 设置容器宽度 */
  height: 750px; /* 图表容器高度 */
  background: white; /* 图表背景色 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  margin: 20px 0; /* 与其他元素的间距 */
}

.variables-container {

}

.variable-button {
  margin: 15px;
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
.chart-container2 {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column; /* 变更为列布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 95%; /* 设置容器宽度 */
  height: 600px; /* 图表容器高度 */
  border-radius: 8px; /* 圆角 */
  margin: 0px 0; /* 与其他元素的间距 */
}
</style>
