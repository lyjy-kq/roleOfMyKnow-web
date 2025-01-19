<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import axios from "axios";
import * as jsonArray from "echarts/types/dist/shared";
import {getQualificationSalaryService} from "@/api/charts.js";

// 使用 ref 来创建两个响应式的 ECharts 实例
const myChart1 = ref(null);
async function getData1() {
  let result = await getQualificationSalaryService();

  const {data} = result;
  const trueData = data;
  console.log(trueData)
  // 处理数据
  const chartData = trueData.map(item => item.data);
  const xAxisData = trueData.map(item => item.classification);
  console.log(xAxisData)

  const Rdata = [];
  const jsonObjects = [];
  for (let i = 0; i < chartData.length; i++) {
    jsonObjects.push(JSON.parse(chartData[i]));
  }
  console.log(jsonObjects)
  const filteredArray1 = []
  const filteredArray2 = []
  const classifi = ["5000元以下", "5000-9999元/月", "10000-14999元/月", "15000-19999元/月", "20000-24999元/月", "25000-29999元/月", "30000-34999元/月", "35000元及以上"]
  for (let j = 0; j < classifi.length; j++) {
    for (let i = 0; i < jsonObjects.length; i++) {
      filteredArray1.push(jsonObjects[i].filter(item => item.x === classifi[j]));
      filteredArray2.push(filteredArray1[i].map(item => item.y || 0))
    }
    let newArray = filteredArray2.map(subarray => subarray.length > 0 ? subarray[0] : 0);
    console.log(newArray)
    Rdata.push(newArray);
    filteredArray1.length = 0;
    filteredArray2.length = 0;
    // console.log(filteredArray2);
  }
  console.log(Rdata[2])

  // 初始化图表
  initChart1(document.getElementById('main1'), myChart1, xAxisData, Rdata);


}
function initChart1(chartDom, chartRef, xAxisData, yAxisData) {
  if (chartDom) {
    chartRef.value = echarts.init(chartDom);
    const option = {

      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          let result = params.name + '<br/>'; // 显示 x 轴标签
          let seriesData = [];
          // 遍历所有系列，找到与当前 x 轴相同的值
          option.series.forEach(series => {
            if (series.data && series.data[params.dataIndex] !== undefined) {
              seriesData.push(series.name + ': ' + series.data[params.dataIndex]);
            }
          });
          result += seriesData.join('<br/>'); // 将所有系列的值添加到结果中
          return result;
        }
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ["中专/中技", "初中及以下",  "博士", "大专",


              "学历不限",

              "本科",

              "硕士",
              "高中"]

        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '5000元以下',
          type: 'bar',
          emphasis: {
            focus: 'series'
          },
          data: yAxisData[0],
        },
        {
          name: '5000-9999元/月',
          type: 'bar',

          emphasis: {
            focus: 'series'
          },
          data: yAxisData[1],
        },
        {
          name: '10000-14999元/月',
          type: 'bar',

          emphasis: {
            focus: 'series'
          },
          data: yAxisData[2],
        },
        {
          name: '15000-19999元/月',
          type: 'bar',
          emphasis: {
            focus: 'series'
          },
          data: yAxisData[3],
        },
        {
          name: '20000-24999元/月',
          type: 'bar',
          data: yAxisData[4],
          emphasis: {
            focus: 'series'
          },
          // markLine: {
          //   lineStyle: {
          //     type: 'dashed'
          //   },
          //   data: [[{ type: 'min' }, { type: 'max' }]]
          // }
        },
        {
          name: '25000-29999元/月',
          type: 'bar',

          emphasis: {
            focus: 'series'
          },
          data: yAxisData[5],
        },
        {
          name: '30000-34999元/月',
          type: 'bar',

          emphasis: {
            focus: 'series'
          },
          data: yAxisData[6]
        },
        {
          name: '35000元及以上',
          type: 'bar',

          emphasis: {
            focus: 'series'
          },
          data: yAxisData[7]
        }

      ]
    };
    chartRef.value.setOption(option);
  }
}
onMounted(() => {
  getData1();


});
</script>

<template>
  <div class="chart-container" style="width: 100%; height: 700px; margin-right: 2%; margin-top: 5%">
    <div id="main1" style="width: 100%; height: 90%;"> </div>

  </div>
</template>


<style>

.chart-description {
  text-align: center;
  margin-top: 10px; /* 调整与图表的间距 */
  font-size: 16px; /* 可选：调整字体大小 */
  color: #666; /* 可选：调整文字颜色 */
}
.chart-container {
  position: relative;
  overflow: hidden;
  width: 80%;
  height: 500px;
}

@media (max-width: 1000px) {
  .chart-container {
    width: 100%;
    float: none;
    margin-right: 0;
    margin-bottom: 20px;

  }
}
</style>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: row; /* 更改为列布局，以便内容垂直居中 */
    align-items: center;
    margin-top: -50px;

  }
}
</style>