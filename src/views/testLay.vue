<template>
  <div class="container">
    <header class="header">
      <img src="./path/to/logo.png" alt="网站标志" class="logo" />
      <h1>数据分析平台</h1>
      <p>欢迎来到数据分析平台，您可以在这里探索和分析各种数据趋势！</p>
    </header>

    <main class="main-content" :class="{ active: selectedModule !== null }">
      <section
          v-for="(module, index) in modules"
          :key="index"
          class="module"
          :class="{ active: selectedModule === index }"
          :style="{ backgroundColor: module.color }"
          @click="selectModule(index)"
      >
        <h2>{{ module.title }}</h2>
        <p>{{ module.description }}</p>
      </section>
    </main>

    <footer class="footer">
      <p>© 2023 数据分析团队 | 作者: Your Name</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      selectedModule: null,
      modules: [
        { title: '省份相关数据', description: '了解各省份的相关数据及趋势分析。', color: '#ffcd57' },
        { title: '薪资与学历关系', description: '探讨薪资水平与学历之间的关系。', color: '#58bb8c' },
        { title: '薪资与经验关系', description: '分析薪资与工作经验的关联。', color: '#ff708d' },
        { title: '招聘公司类别', description: '了解不同招聘公司类型及其特点。', color: '#6f94fc' },
        { title: '用户咨询', description: '需要帮助？请发起咨询，我们将及时响应。', color: '#ff5722' },
      ]
    }
  },
  methods: {
    selectModule(index) {
      this.selectedModule = index;
    },
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: #4a90e2;
  color: white;
  padding: 20px;
  text-align: center;
}

.header .logo {
  max-width: 150px; /* 修改 logo 大小 */
  height: auto; /* 自适应高度 */
}

.header h1 {
  margin: 10px 0 5px; /* 顶部和底部的margin调整 */
}

.main-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap; /* 换行 */
  padding: 20px;
  justify-content: center;
  flex-grow: 1;
}

.module {
  flex: 1;
  max-width: 200px;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.5s ease, background-color 0.3s;
  position: relative;
  opacity: 1;
  height: 150px; /* 设置固定高度 */
  overflow: hidden; /* 限制内容溢出 */
}

.module:hover {
  transform: scale(1.05);
}

.module.active {
  transform: translateY(-10px) scale(1.1); /* 修改动画效果 */
  opacity: 1;
  z-index: 1;
}

.main-content.active .module:not(.active) {
  transform: scale(0.8);
}

.footer {
  background-color: #333;
  color: white;
  padding: 10px;
  text-align: center;
}
</style>