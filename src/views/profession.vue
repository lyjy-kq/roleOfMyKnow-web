<script setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import axios from "axios"; // 使用 axios 进行 HTTP 请求

// 响应式变量
const selectedCompany = ref(null); // 当前选择的公司
const fieldChart = ref(null); // 第一个饼状图实例

// 公司分类数据
const industries = [
  {
    name: "金融",
    companies: [{ id: 1, name: "招商银行" }],
  },
  {
    name: "互联网",
    companies: [
      { id: 5, name: "华为" },
      { id: 6, name: "腾讯" },
      { id: 7, name: "阿里巴巴" }, // 点击此公司会触发获取数据并更新图表
    ],
  },
  {
    name: "医药",
    companies: [
      { id: 9, name: "恒瑞医药" },
      { id: 10, name: "迈瑞医疗" },
      { id: 11, name: "生物康德" },
      { id: 12, name: "药明生物" },
    ],
  },
];

// 初始化图表
function initChart(chartDom, chartRef, chartData, title) {
  if (chartDom) {
    chartRef.value = echarts.init(chartDom);
    const option = {
      title: {
        text: title,
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "比例",
          type: "pie",
          radius: "50%",
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    chartRef.value.setOption(option);
  }
}

// 使用 POST 方法获取公司数据
async function getCompanyData(companyName) {
  try {
    // 调用后端 POST 接口，传递公司名称
    const response = await axios.post("http://localhost:8080/companyMajor", { company: companyName });

    // 确认接口返回的数据
    const { data } = response.data;

    // 将返回的对象转换为图表所需的数据格式
    const chartData = Object.keys(data).map((key) => ({
      name: key,
      value: data[key],
    }));

    // 更新第一个饼状图
    initChart(
        document.getElementById("fieldChart"),
        fieldChart,
        chartData,
        `${companyName} 职位分布`
    );
  } catch (error) {
    console.error("获取数据失败:", error);
  }
}

// 点击公司时触发
function handleCompanyClick(companyName) {
  selectedCompany.value = companyName;
  getCompanyData(companyName); // 调用函数获取数据并更新图表
}

onMounted(() => {
  // 初始化默认显示的图表
  getCompanyData("招商银行"); // 默认显示第一个公司
});
</script>

<template>
  <div>
    <!-- 导航栏 -->
    <div class="navbar">
      <div
          v-for="industry in industries"
          :key="industry.name"
          class="industry-card"
      >
        <div class="industry-name">{{ industry.name }}</div>
        <div class="companies">
          <span
              v-for="company in industry.companies"
              :key="company.id"
              class="company"
              :class="{ active: selectedCompany === company.name }"
              @click="handleCompanyClick(company.name)"
          >
            {{ company.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- 图表容器 -->
    <div class="charts-container">
      <div id="fieldChart" class="chart-card"></div>
    </div>
  </div>
</template>

<style>
/* 导航栏样式 */
.navbar {
  display: flex;
  justify-content: space-around;
  background-color: #f9fafc;
  padding: 20px;
  border-bottom: 2px solid #eaeaea;
}
.industry-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  width: 30%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}
.industry-card:hover {
  transform: scale(1.05);
}
.industry-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}
.companies {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
.company {
  padding: 5px 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}
.company:hover {
  background-color: #007bff;
  color: #ffffff;
}
.company.active {
  background-color: #0056b3;
  color: #ffffff;
}

/* 图表容器样式 */
.charts-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 30px;
}
.chart-card {
  width: 60%;
  height: 400px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.2s;
}
.chart-card:hover {
  transform: scale(1.02);
}

/* 响应式 */
@media (max-width: 768px) {
  .industry-card {
    width: 90%;
    margin-bottom: 20px;
  }
  .charts-container {
    flex-direction: column;
    align-items: center;
  }
  .chart-card {
    width: 90%;
    margin-bottom: 20px;
  }
}
</style>