<template>
  <div class="about">
    <div class="header">
      <!-- Header Content -->
    </div>

    <div class="chart-container">
      <div class="select-container">
        <select v-model="selectedOption" @change="updateChart" class="styled-select">
          <option v-for="(item, index) in options" :key="index" :value="index">{{ item }}</option>
        </select>
        <button @click="toggleChartType" class="toggle-button">{{ isBarChart ? '切换为饼状图' : '切换为柱状图' }}</button>
      </div>
      <div id="main1" class="chart" style="width: 100%; height: 90%; margin-top: 3%"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import { getEducationService, getDescriptionService } from "@/api/charts.js";

const props = defineProps({
  provinceName: String
});
const provinceToRouteMap = {
    20: '广东省',
    1: '北京市',
    2: '天津市',
    5: '河北省',
    6: '山西省',
    7: '内蒙古自治区',
    8: '辽宁省',
    9: '吉林省',
    10: '黑龙江省',
    3: '上海市',
    11: '江苏省',
    12: '浙江省',
    13: '安徽省',
    14: '福建省',
    15: '江西省',
    16: '山东省',
    17: '河南省',
    18: '湖北省',
    19: '湖南省',
    4: '重庆市',
    23: '四川省',
    24: '贵州省',
    25: '云南省',
    26: '西藏自治区',
    27: '陕西省',
    28: '甘肃省',
    29: '青海省',
    30: '宁夏回族自治区',
    31: '新疆维吾尔自治区',
    32: '香港特别行政区',
    33: '澳门特别行政区',
    34: '台湾省'
}
const qua = ["不限", "初中", "中专/中技", "高中", "大专", "本科", "硕士", "博士"];
const exp = ["无经验", "经验不限", "1年以下", "1-3年", "3-5年", "5-10年", "10年以上"];
const options = ["不同学历下的岗位数量", "不同经验要求下的岗位数量", "岗位对于工作技能要求", "需求工程师岗位的技能要求"];
const selectedOption = ref(0); // 默认选择第一个选项
const chartTitle = ref(provinceToRouteMap[props.provinceName]+'数据一览'); // 图表标题
const isBarChart = ref(true); // 用于切换图表类型
const description = ref([]); // 存储描述信息

async function getDes() {
  const result = await getDescriptionService();
  const { data } = result;
  description.value = data.data.map(item => item.text); // 保存获取到的描述信息

  console.log(data);
  console.log(description.value)
}

async function getData1() {
  const postData = {
    id: 0,
    qualification: selectedOption.value === 0 ? 0 : -1,
    salary: -1,
    location: parseInt(props.provinceName, 10),
    businessNature: -1,
    field: -1,
    workExperience: selectedOption.value === 1 ? 0 : -1,
    actual_salary: -1,
    sixNum: selectedOption.value === 2 ? 0 : -1,
    fiveNum: selectedOption.value === 3 ? 0 : -1,
  };

  let result = await getEducationService(postData);
  const { data } = result;
  const chartData1 = data.map(item => item.result);
  let xAxisData1 = (selectedOption.value === 0 || selectedOption.value === 1) ?
      (selectedOption.value === 0 ? data.map(item => qua[item.x - 1]) : data.map(item => exp[item.x - 1])) :
      data.map(item => item.x);

  initChart1(document.getElementById('main1'), chartData1, xAxisData1);
}

function initChart1(chartDom, chartData, xAxisData) {
  if (chartDom) {
    const chartRef = echarts.init(chartDom);
    const option = {
      title: {
        text: chartTitle.value,
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: params => {
          const index = params.dataIndex;
          const descriptionText = description.value[index] || ""; // 获取对应描述信息

          // 判断 selectedOption.value 是否为2
          if (selectedOption.value === 2) {
            return `
        <div style="max-width: 200px; word-wrap: break-word; white-space: normal;">
          <strong>${params.name}</strong>: ${params.value}家企业在招<br />
          ${descriptionText}
        </div>
      `;
          } else {
            return `
        <div style="max-width: 200px; word-wrap: break-word; white-space: normal;">
          <strong>${params.name}</strong>: ${params.value}家企业在招
        </div>
      `;
          }
        }
      },
      grid: isBarChart.value
          ? {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          }
          : undefined,
      xAxis: isBarChart.value ? [
        {
          type: 'category',
          data: xAxisData,
          axisTick: {
            alignWithLabel: true
          }
        }
      ] : undefined,

      yAxis: isBarChart.value ? [
        {
          type: 'value'
        }
      ] : undefined,

      series: [
        {
          type: isBarChart.value ? 'bar' : 'pie',
          radius: isBarChart.value ? null : '70%',
          data: isBarChart.value ? chartData : xAxisData.map((label, index) => ({ value: chartData[index], name: label })),
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

function updateChart() {
  chartTitle.value = options[selectedOption.value]; // 更新标题为选择框的当前值
  getData1();
}

function toggleChartType() {
  isBarChart.value = !isBarChart.value; // 切换图表类型
  updateChart(); // 更新图表
}

onMounted(() => {
  getData1();
  getDes();
});
</script>

<style scoped>
.about {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  padding: 20px;
}

.chart-container {
  position: relative;
  overflow: hidden;
  width: 90%;
  height: 750px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.select-container {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
}

.styled-select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  transition: border-color 0.3s;
}

.styled-select:hover {
  border-color: #58bb8c;
}

.styled-select:focus {
  outline: none;
  border-color: #58bb8c;
}

.toggle-button {
  padding: 10px 15px;
  font-size: 16px;
  margin-left: 10px;
  border: none;
  border-radius: 5px;
  background-color: #58bb8c;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-button:hover {
  background-color: #45a76e;
}
</style>
