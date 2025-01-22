<template>
  <header class="app-header">
    <img src="@/assets/icon.png" alt="Logo" class="logo" />
    <div class="welcome-message">
      <h1>欢迎来到"你职我知"！</h1>
      <!-- 添加下拉选择框 -->
      <select @change="reloadPage" class="role-select" v-model="selectedRole">
        <option disabled selected style="color: azure ">选择职业</option>
        <option value="需求工程师">需求工程师</option>
        <option value="软件工程师">软件工程师</option>
        <option value="软件架构师">软件架构师</option>
        <option value="产品经理">产品经理</option>
      </select>
    </div>
    <div class="poem">
      <p>{{ randomPoem }}</p>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue';
import { useStore } from '@/stores';

// 获取 Pinia store
const store = useStore();
const emit = defineEmits(['role-changed']);

// 绑定选择框的模型
const selectedRole = ref(store.selectedRole);

// 设置诗句
const poems = [
  '月落乌啼霜满天，江枫渔火对愁眠。',
  '无边落木萧萧下，不尽长江滚滚来。',
  '床前明月光，疑是地上霜。',
];

// 计算随机诗句
const randomPoem = computed(() => {
  return poems[Math.floor(Math.random() * poems.length)];
});

// 当选择框的选项发生改变时调用这个函数
function reloadPage(event) {
  selectedRole.value = event.target.value; // 更新选中的角色
  store.setSelectedRole(selectedRole.value); // 更新 Pinia store 的状态
  emit('role-changed', selectedRole.value); // 发射事件
}
</script>


<style scoped>
.app-header {
  display: flex; /* 横向排列 */
  justify-content: space-between; /* 元素之间的空间分配 */
  align-items: center; /* 垂直居中对齐 */
  padding: 20px;
  background-color: #f8f8f8; /* 可以自定义背景颜色 */
  height: 40px;
}

.logo {
  height: 110%; /* 根据需要设置logo高度 */
}

.welcome-message {
  flex-grow: 1; /* 占据剩余空间 */
  text-align: left; /* 中间对齐 */
  margin-left: 5%;
  display: flex; /* 横向排列 */
  align-items: center; /* 垂直居中对齐 */
}

.poem {
  text-align: right; /* 右对齐 */
}

.role-select {
  margin-left: 20px; /* 与标题之间的间距 */
  padding: 10px 20px; /* 调整内边距使选择框更大 */
  font-size: 16px;
  border-radius: 5px; /* 圆角 */
  border: none; /* 去除边框 */
  background-color: #666666; /* 背景色与按钮一致 */
  color: white; /* 文字颜色 */
  cursor: pointer; /* 鼠标悬停显示为可点击 */
  transition: background-color 0.3s; /* 过渡效果 */
  outline: none; /* 去除默认的聚焦边框 */
}

.role-select:hover {
  background-color: #666666; /* 悬停时背景色变化 */
}

</style>
