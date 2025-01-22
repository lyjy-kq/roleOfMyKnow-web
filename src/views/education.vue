<script setup>
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getEducationService } from '@/api/charts.js';
import { useRouter } from 'vue-router';
import { Promotion, Switch } from "@element-plus/icons-vue";

const router = useRouter();
const currentChart = ref(1); // 当前显示的图表（1：学历要求，2：工作经验）

const myChart = ref(null); // 当前图表实例
const errorMsg = ref(null);
const where =ref("与工作经验关系")
const chartContainerHeight = ref(window.innerHeight * 0.7); // 动态设置高度

function resizeChart() {
  chartContainerHeight.value = window.innerHeight * 0.7;
  if (myChart.value) myChart.value.resize(); // 图表大小调整
}

// 切换图表
function showChart(chartNumber) {
  currentChart.value = chartNumber;
  if (chartNumber === 1) {
    getData1()
    where.value="与工作经验关系";
  } else if (chartNumber === 2) {
    getData2();
    where.value="与学历关系";
  }
}

// 获取并初始化第一个柱状图数据（学历要求）
async function getData1() {
  try {
    const postData = {
      id: 0,
      qualification: 0,
      salary: -1,
      location: -1,
      businessNature: -1,
      field: -1,
      workExperience: -1,
      actual_salary: -1,
      sixNum: -1,
      fiveNum: -1,
    };

    const result = await getEducationService(postData);

    if (!result || !result.data) {
      throw new Error('API 返回的数据为空或者格式不正确');
    }

    const data = result.data;
    const xAxisData = ['不限', '初中', '中专/中技', '高中', '大专', '本科', '硕士', '博士'];
    const yAxisData = data.map(item => Number(item['result']));

    initBarChart(document.getElementById('chart-container'), xAxisData, yAxisData, '岗位数量与学历的关系', '/DetailEdu');
  } catch (error) {
    errorMsg.value = '获取数据时出错: ' + error.message;
    console.error('Error fetching data:', error);
  }
}

// 获取并初始化第二个柱状图数据（工作经验）
async function getData2() {
  try {
    const postData = {
      id: 0,
      qualification: -1,
      salary: -1,
      location: -1,
      businessNature: -1,
      field: -1,
      workExperience: 0,
      actual_salary: -1,
      sixNum: -1,
      fiveNum: -1,
    };

    const result = await getEducationService(postData);

    if (!result || !result.data) {
      throw new Error('API 返回的数据为空或者格式不正确');
    }

    const data = result.data;
    const xAxisData = ['无经验', '经验不限', '1年以下', '1-3年', '3-5年', '5-10年', '10年以上'];
    const yAxisData = data.map(item => Number(item['result']));

    initBarChart(document.getElementById('chart-container'), xAxisData, yAxisData, '岗位数量与工作经验的关系', '/DetailExp');
  } catch (error) {
    errorMsg.value = '获取数据时出错: ' + error.message;
    console.error('Error fetching data:', error);
  }
}

// 初始化通用的柱状图并添加点击事件
function initBarChart(chartDom, xAxisData, yAxisData, title, routePath) {
  if (!chartDom) {
    console.error('Chart container DOM element not found');
    return;
  }

  // 销毁旧图表实例
  if (myChart.value) {
    myChart.value.dispose();
  }

  // 初始化新的图表实例
  chartDom.style.width = '100%';
  chartDom.style.height = '80%'; // 设置动态高度
  myChart.value = echarts.init(chartDom);

  const option = {
    title: {
      text: title,
      subtext: '点击图表查看详情',  // 添加副标题
      left: 'center',
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
    },
    series: [
      {
        name: '数据',
        type: 'bar',
        data: yAxisData,
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
        },
      },
    ],
  };

  // 设置图表配置
  myChart.value.setOption(option);

  // 添加点击事件
  myChart.value.on('click', () => {
    router.push(routePath); // 路由跳转
  });
}

onMounted(async () => {
  await nextTick();  // 等待 DOM 完全挂载
  showChart(1);      // 默认显示第一个图表
  window.addEventListener('resize', resizeChart); // 监听窗口大小调整
});

onBeforeUnmount(() => {
  if (myChart.value) myChart.value.dispose(); // 销毁图表实例
  window.removeEventListener('resize', resizeChart); // 移除事件监听
});

// 切换按钮的功能
function switchC() {
  if (currentChart.value === 1) {
    showChart(2); // 切换到工作经验图表
  } else {
    showChart(1); // 切换到学历要求图表
  }
}
</script>

<template>
  <div class="about">
    <div class="chart-container">
      <el-icon></el-icon>
      <div @click="switchC" class="toggle-button" style="display: flex; align-items: center;">
        <Switch style="width: 1.5em; height: 1.5em; margin-right: 8px"></Switch>
        <span>切换到{{where}}</span>

      </div>

      <div id="chart-container" class="echarts-container"></div>
    </div>
    <p v-if="errorMsg">{{ errorMsg }}</p>
  </div>
</template>

<style scoped>
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

.echarts-container {
  width: 100%;
  height: 100%;
  margin-top: 3%;
}

</style>
