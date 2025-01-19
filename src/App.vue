<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/views/Bar/testLay.vue';
import HeaderComponent from "@/views/Bar/HeaderComponent.vue";
import FooterComponent from "@/views/Bar/FooterComponent.vue";

const route = useRoute(); // 获取当前路由
const selectedRoleKey = ref(0); // 用于强制重新加载的 key

// 更新 selectedRoleKey 来强制刷新 <router-view>
function updateRole() {
  selectedRoleKey.value++; // 改变 key 强制刷新 <router-view>
}
</script>

<template>
  <div id="app">
    <!-- HeaderComponent 监听角色变化 -->
    <HeaderComponent v-if="route.name !== 'login'" @role-changed="updateRole" />
    <br>
    <div class="main-content">
      <NavBar v-if="route.name !== 'login'" />
      <div class="content">
        <!-- 基于 selectedRoleKey 设置 key 来强制刷新 router-view -->
        <router-view :key="selectedRoleKey" />
      </div>
    </div>
    <FooterComponent v-if="route.name !== 'login'" />
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 满高 */
}

.main-content {
  flex: 1; /* 使主内容区域占据剩余空间 */
  display: flex; /* Flex布局 */
}

.content {
  flex: 1; /* 右侧内容区域占据剩余空间 */
  padding: 20px; /* 内边距 */
}
</style>
