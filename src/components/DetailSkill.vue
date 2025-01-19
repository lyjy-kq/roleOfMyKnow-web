<template>
  <div class="chart-page">
    <div class="card-container">
      <div class="card">
        <div class="card-header">
          该领域招聘数目最多的三个公司
        </div>
        <div class="card-body">

          <span style="white-space: pre-wrap;">公司：<br>{{ companyCardData.text }}</span>
        </div>
      </div>
    </div>
    <div class="dropdown-container">

      <label for="category-select">选择对比类别：</label>
      <select id="category-select" v-model="selectedCategory" @change="updateChart">
        <option value="技能对比">技能对比</option>
        <option value="职责要求">职责要求</option>
      </select>
    </div>
    <div id="pie-chart" class="echarts-container"></div>
  </div><el-icon></el-icon>
  <div @click="switchC" class="toggle-button" style="display: flex; align-items: center;">
    <Switch style="width: 1.5em; height: 1.5em; margin-right: 8px"></Switch>
    <span>返回</span>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import { useRoute } from 'vue-router';
import { getEducationService,getCompanyService } from "@/api/charts.js";
import { Promotion, Switch } from "@element-plus/icons-vue";
import router from "@/router/index.js";

const pieChart2 = ref(null);
const selectedCategory = ref('技能对比');
const companyCardData = ref({

  text: '',
});
const route = useRoute();

function switchC() {
  router.push('/company'); // 路由跳转
}

async function getPieData(category, field) {
  const sixNumValue = category === '技能对比' ? 0 : -1;
  const fiveNumValue = category === '职责要求' ? 0 : -1;

  // 传递点击的领域作为location
  const postData = {
    id: 0,
    qualification: -1,
    salary: -1,
    location: parseInt(field),
    businessNature: -1,
    field: -1,
    workExperience: -1,
    actual_salary: -1,
    sixNum: sixNumValue,
    fiveNum: fiveNumValue,
  };

  try {
    // 假设返回的数据格式为 result.data
    const result = await getEducationService(postData);  // 在这里使用实际的 API 调用
    const skillsNames = ["工作方法", "经验", "能力", "知识", "工具", "其他"];
    const responsibilitiesNames = ["需求获取", "需求分析", "需求规范", "需求验证", "需求管理"];

    const names = category === '技能对比' ? skillsNames : responsibilitiesNames;

    const pieData = names.map((name, index) => ({
      value: Number(result?.data[index]?.result || 0),
      name,
    }));

    return pieData;
  } catch (error) {
    console.error('获取饼图数据时出错:', error);
    throw error;
  }
}

async function getCompanyData() {
  try {
    const postData = { 'type': 1 }; // 获取从第一个图表传递的领域
    const result = await getCompanyService(postData);
    console.log(result.data);
    console.log(route.query);

    // 映射关系
    const fieldToClassificationMapping = {
      '互联网IT': '1',
      '金融业': '2',
      '贸易/零售/物流': '3',
      '公共管理': '4',
      '房地产/建筑': '5',
      '其他': '6'
    };

    // 使用映射来找到与 field 对应的 classification
    const classification = fieldToClassificationMapping[route.query.field];

    // 查找与 classification 匹配的第一个结果
    const companyData = result.data.data.find(item => item.classification === classification);

    console.log(companyCardData.value);

    // 如果找到匹配项，则更新 companyCardData
    if (companyData) {
      companyCardData.value = companyData;
    } else {
      companyCardData.value = { text: '没有找到相关公司信息' }; // 反馈信息
    }
  } catch (error) {
    console.error('获取公司数据时出错:', error);
  }
}
function updateChart() {
  const field = route.query.field || ''; // 获取从第一个图表传递的领域
  getCompanyData();
  getPieData(selectedCategory.value, field).then((pieData) => {
    const chartDom = document.getElementById('pie-chart');
    if (pieChart2.value) {
      pieChart2.value.dispose(); // 销毁旧图表
    }
    pieChart2.value = echarts.init(chartDom);

    const option = {
      title: {
        text: field, // 显示领域名称
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
          radius: '50%',
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

    pieChart2.value.setOption(option);
  }).catch((error) => {
    console.error('更新饼图时出错:', error);
  });
}

onMounted(() => {
  updateChart(); // 初始化时加载图表
});

// 监听 selectedCategory 改变时动态更新图表
watch(selectedCategory, () => {
  updateChart();
});
</script>

<style scoped>
.chart-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}
.toggle-button {
  position: absolute; /* 绝对定位 */
  top: 200px; /* 距离顶部20px */
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
.card {
  width: 300px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.card-header {
  font-weight: bold;
  margin-bottom: 10px;
}

.dropdown-container {
  margin-bottom: 20px;
}

.echarts-container {
  width: 90%;
  height: 500px;
}
</style>