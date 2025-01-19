<template>
  <nav class="navbar">
    <router-link class="nav-link" to="/china">省份相关数据</router-link>
    <router-link class="nav-link" to="/salary/qualification">薪资与学历关系</router-link>
    <router-link class="nav-link" to="/salary/experience">薪资与经验关系</router-link>
    <router-link class="nav-link" to="/sectionNature">招聘公司类别</router-link>
    <router-link class="nav-link" to="/sectionNature">招聘公司类别</router-link>
    <router-link class="nav-link" to="/profession">专业</router-link>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  background-color: transparent;
  /* 移除整个导航栏的阴影 */
}

.nav-link {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  margin: 0 10px; /* 增加间距 */
  text-decoration: none;
  color: #2c3e50;
  background-color: #fff; /* 假设背景色为白色 */
  border-radius: 5px; /* 圆角 */
  transition: transform 0.3s, box-shadow 0.3s;
  /* 轻微的阴影 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
  border-radius: 0 0 10px 10px;
  opacity: 0;
  transition: opacity 0.3s;
}

.nav-link:hover {
  /* 悬停时变换 */
  transform: translateY(-3px);
  box-shadow: 0 7px 10px rgba(0, 0, 0, 0.2);
}

.nav-link:hover::before {
  /* 悬停时显示伪元素 */
  opacity: 1;
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  /* 激活状态 */
  background-color: #42b983;
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

/* 注意：激活状态的伪元素可能需要额外的样式来适应背景色变化 */
</style>