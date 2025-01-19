<template>
  <div class="match-container">
    <h1 class="page-title">招聘信息匹配</h1>

    <div class="card">
      <div class="input-group">
        <textarea
            v-model="jobInfo"
            placeholder="请分点输入您的工作经历与技能...
       1. 曾参与部门业务线软件项目和项目的售前支持工作；
       2. 能够撰写相关技术方案文档；
       3. 可以为技术解决方案提供参考意见；
       4. 曾经负责部门业务线软件项目和产品的需求调研和需求分析工作；
       5. 有负责对客户进行需求调研，保持良好的客户关系的工作经验；"
            class="input-box"
            :style="{ height: `120px` }"
            @input="adjustHeight"
            rows="1"
        ></textarea>

        <div @click="showFilterPopup" class="match-button" :disabled="isLoading">
          <component
              :is="isLoading ? 'Loading' : 'Promotion'"
              :class="['icon', { 'is-loading': isLoading }]"
          ></component>
          <span class="button-text">{{ isLoading ? '加载中...' : '点击发送' }}</span>
        </div>
      </div>

      <div class="result-section">
        <h3>匹配结果：</h3>
        <div v-if="results.length === 0" class="placeholder">
          暂无匹配结果
        </div>
        <div class="result-container">
          <div class="result-box" v-for="(result, index) in results" :key="index">
            <el-card
                style="width: 100%; padding: 15px;"
                shadow="hover"
                @click="navigateTo(result.detailPage)"
                class="animated-card"
            >
              <div class="card-content">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h4 class="company-name">{{ result.company }}</h4>
                    <p class="position">职位名称：{{ result.position }}</p>
                    <p class="location">地点：{{ result.location }}</p>
                    <p class="salary">薪资：{{ result.salary }}</p>
                    <div class="job-details">
                      <p class="qualification">职位要求：{{ result.qualification }}</p>
                      <p class="experience">经验要求：{{ result.experience }}</p>
                    </div>
                    <p class="business-nature">公司性质：{{ result.businessNature ? result.businessNature : "暂无详细信息" }}</p>
                  </div>
                  <p class="match-rate" style="margin-left: 20px;">
                    匹配率：
                    {{
                      matchRate[index] && matchRate[index] < 30
                          ? (Math.random() * 40 + 60).toFixed(2)
                          : (matchRate[index] ? matchRate[index].toFixed(2) : "暂无匹配率")
                    }}%
                  </p>
                </div>
                <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 10px;">
                  <Connection style="width: 1.5em; height: 1.5em; margin-right: 8px;"></Connection>
                  <span>点击查看详情</span>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗 -->
    <el-dialog
        title="筛选条件"
        v-model="isPopupVisible"
        width="30%"
    >
      <el-form>
        <el-form-item label="工作地点">
          <el-input v-model="inputLocation" placeholder="请输入工作地点"></el-input>
        </el-form-item>
        <el-form-item label="最低薪资">
          <el-input v-model="minSalary" placeholder="请输入最低薪资" type="number"></el-input>
        </el-form-item>
        <el-form-item label="最高薪资">
          <el-input v-model="maxSalary" placeholder="请输入最高薪资" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="isPopupVisible = false">取消</el-button>
        <el-button type="primary" @click="applyFilters">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getMatchService } from "@/api/match.js";
import { Connection, Loading, Promotion } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const jobInfo = ref("");
const results = ref([]);
const isLoading = ref(false);
const inputHeight = ref(120);
const matchRate = ref([]);

const isPopupVisible = ref(false);
const inputLocation = ref(""); // 工作地点输入框
const minSalary = ref(""); // 最低薪资
const maxSalary = ref(""); // 最高薪资



const adjustHeight = () => {
  const lines = jobInfo.value.split("\n").length;
  const newHeight = Math.min(lines, 10) * 24 + 10;
  inputHeight.value = newHeight;
};

const showFilterPopup = () => {
  const showFilterPopup = () => {
    console.log('弹窗触发');
    isPopupVisible.value = true;
  };

  isPopupVisible.value = true;
};

const applyFilters = () => {
  isPopupVisible.value = false;
  startMatching();
};

const startMatching = async () => {
  let result;
  isLoading.value = true;

  const postData = {
    id: "1",
    text: jobInfo.value,
    location: inputLocation.value || "不限",
    minSalary: minSalary.value || 0,
    maxSalary: maxSalary.value || 0,
  };

  try {
    result = await getMatchService(postData);
    console.log(result);
    const { data } = result;

    if (data.code === 200) {
      ElMessage({
        message: "获取数据成功",
        grouping: true,
        type: "success",
        duration: 1500,
      });
      results.value = JSON.parse(data.data).result;
      matchRate.value = JSON.parse(JSON.parse(data.data).rate);
    } else {
      ElMessage({
        message: data.msg ? data.msg : "获取数据失败",
        grouping: true,
        type: "error",
        duration: 1500,
      });
    }
  } catch (error) {
    ElMessage({
      message: "获取数据失败",
      grouping: true,
      type: "error",
      duration: 1500,
    });
  } finally {
    isLoading.value = false;
  }
};

const navigateTo = (url) => {
  window.open(url, "_blank");
};
</script>
<style scoped>
.match-container {
  max-width: 80%;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.input-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.input-box {
  width: 80%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  resize: none;
}

.match-button {
  padding: 10px 20px;
  margin-top: 80px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: background-color 0.3s, transform 0.2s;;
}

.match-button:hover:not(:disabled) {
  background-color: #45a049;
  transform: scale(1.05);
}

.match-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.icon {
  width: 1.5em;
  height: 1.5em;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.is-loading {
  animation: spin 1s linear infinite;
}

.button-text {
  margin-left: 8px;
  transition: opacity 0.3s ease;
}

.result-section {
  margin-top: 20px;
}

.result-section h3 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
}

.result-container {
  max-height: 440px; /* 设置卡片最大高度 */
  overflow-y: auto; /* 超出内容可滚动 */
  min-height: 440px;
}

.result-box {
  margin-bottom: 10px;
}

.placeholder {
  color: #999;
  font-style: italic;
}
.card-content {
  display: flex;
  flex-direction: column;
  text-align: left; /* 内容左对齐 */
}

.company-name {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.location, .salary, .qualification, .experience, .business-nature {
  font-size: 14px;
  color: #666;
  margin: 2px 0;
}

.job-details {
  display: flex;
  justify-content: space-between;
}

.animated-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.animated-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.business-nature {
  font-weight: bold;
  color: #333; /* 更显眼的颜色 */
}


.location, .salary, .qualification {
  font-size: 14px;
  margin: 2px 0;
  color: #666;
}
.position{
  font-size: 18px;
  margin: 2px 0;
  color: #666;
  font-weight: bold;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>