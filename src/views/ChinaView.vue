<template>
  <div class="about">
    <div class="chart-container">
      <div @click="getAvg" class="toggle-button" style="display: flex; align-items: center;">
        <Promotion style="width: 1.5em; height: 1.5em; margin-right: 8px"></Promotion>
        <span>更新数据</span>
      </div>
      <div ref="charts" class="echarts-container"  ></div>
    </div>
    <div class="summary">
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from "vue";
import * as echarts from "echarts";
import china from "@/assets/china.json";
import router from "@/router/index.js";
import axios from "axios"; // 确保这是正确的 GeoJSON 格式
import {getEducationService} from "@/api/charts.js";
import {Promotion, Share} from "@element-plus/icons-vue";
import { useRoute } from 'vue-router';
const route=useRoute()
const charts = ref(null);
const provinceToRouteMap = {
  '广东省': 20,
  '北京市': 1,
  '天津市': 2,
  '河北省': 5,
  '山西省': 6,
  '内蒙古自治区': 7,
  '辽宁省': 8,
  '吉林省': 9,
  '黑龙江省': 10,
  '上海市': 3,
  '江苏省': 11,
  '浙江省': 12,
  '安徽省': 13,
  '福建省': 14,
  '江西省': 15,
  '山东省': 16,
  '河南省': 17,
  '湖北省': 18,
  '湖南省': 19,
  '重庆市': 4,
  '四川省': 23,
  '贵州省': 24,
  '云南省': 25,
  '西藏自治区': 26,
  '陕西省': 27,
  '甘肃省': 28,
  '青海省': 29,
  '宁夏回族自治区': 30,
  '新疆维吾尔自治区': 31,
  '香港特别行政区': 32,
  '澳门特别行政区': 33,
  '台湾省': 34
};
const routeToProvinceMap = {};
const realDataWithFullNames = ref({});
Object.keys(provinceToRouteMap).forEach((province) => {
  routeToProvinceMap[provinceToRouteMap[province]] = province;
});
watch(
    () => route.path,
    (newPath, oldPath) => {
      setTimeout(() => {
        getAvg();
      }, 1000); // 延迟1秒重新调用fetchData
    }
);
async function getAvg() {
  const postData = {
    id: 0,
    qualification: -1,
    salary: -1,
    location: -0,
    businessNature: -1,
    field: -1,
    workExperience: -1,
    actual_salary: 0,
    sixNum: -1,
    fiveNum: -1,
  };
  let result = await getEducationService(postData);

  const {data} = result;

  const realData = data;
  console.log(realData);
  console.log(realData[2].result)

  Object.keys(realData).forEach((route) => {
    // 使用 provinceToRouteMap 对象将省份简称转换为全称
    const province = routeToProvinceMap[route];

    // 将转换后的全称作为新对象的键，并将值作为新对象的值
    realDataWithFullNames.value[province] = realData[route].result;

  });

  // 数据获取完成后，延迟 100 毫秒初始化图表
  setTimeout(() => {
    initializeChart();
  }, 100);

}

function initializeChart() {
  echarts.registerMap('china', china);

  const chart = echarts.init(charts.value);

  chart.on('click', function (params) {
    if (params.componentType === 'series' && params.seriesType === 'map') {
      const routeName = provinceToRouteMap[params.name];
      if (routeName) {
        router.push(`/china/${routeName}`);
      } else {
        console.error('No route found for province:', params.name);
      }
    }
  });

  const option = {
    title: {
      text: '中国省份平均薪资一览',
      subtext:'点击具体省份可以查看不同省份详情',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      min: 0,
      max: 15000,
      left: '5%',
      top: 'center',
      text: ['高', '低'],
      inRange: {
        color: [
          '#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf',
          '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'
        ]
      }
    },
    series: [
      {
        name: '中国省份',
        type: 'map',
        map: 'china',
        roam: true,
        zoom: 1.25, // 增加缩放比例
        scaleLimit: {
          min: 1,
          max: 2 // 限制最大缩放到2
        },
        data: china.features.map((province) => ({
          name: province.properties.name,
          value: realDataWithFullNames.value[province.properties.name.toString()] || "暂无数据"
        })),
        emphasis: {
          label: {
            show: true
          }
        },
        left: '20%', // 向右调整
        top: '20%', // 向下调整
      }
    ]
  };

  chart.setOption(option);
}
onMounted(() => {
  // 首先注册地图
  getAvg();
});
</script>

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
  align-items: center; /* 水平居中 */
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
