<template>
  <div class="nav-container">
    <header class="nav-header">
      <div class="nav-items">
        <div
            v-for="(item, index) in sections"
            :key="index"
            :class="['nav-item', { 'active': activeIndex === index }]"
            :style="{ backgroundColor: item.color }"
            @click="toggleActive(index)"
        >
          <h3 :class="{ 'active-title': activeIndex === index }">{{ item.title }}</h3>
          <p v-if="activeIndex === index">{{ item.description }}</p>
        </div>
      </div>
    </header>
    <!-- <footer class="footer"> -->
    <!--   <p>© 2023 数据分析团队 | 作者: Your Name</p> -->
    <!-- </footer> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      sections: [
        {title: '省份相关数据', description: '了解各省份的相关数据及趋势分析。', color: '#ffcd57'},
        {title: '薪资与学历/经验关系', description: '探讨薪资水平与学历/经验之间的关系。', color: '#58bb8c'},
        {title: '招聘公司类别', description: '了解不同招聘公司类型及其特点。', color: '#6f94fc'},
        {title: '职业要求技能', description: '分析对应职业所需技能。', color: '#ff708d'},
        {title: '专业分析', description: '当下主流公司的专业。', color: '#6A5ACD'},
        {title: '能力趋势', description: '近期能力变化。', color: '#BDB76B'},
        {title: '智能匹配', description: '给出你的技能与经理,我们将给你推荐些岗位。', color: '#ff5722'},
      ],
      activeIndex: null // 初始没有激活的板块
    };
  },
  methods: {
    toggleActive(index) {
      this.activeIndex = this.activeIndex === index ? null : index; // 切换展开和收起
      switch (index) {
        case 0: // “省份相关数据”
          this.$router.push('/china');
          break;
        case 1: // “薪资与学历关系”
          this.$router.push('/education');
          break;
        case 2:  // “招聘公司类别”
          this.$router.push('/company');
          break;
        case 3: // “技能”
          this.$router.push('/skill');
          break;
        case 4: // “专业”
          this.$router.push('/profession');
          break;
        case 5: // “趋势”
          this.$router.push('/trend');
          break;
        case 6: // “用户咨询”
          this.$router.push('/match');
          break;

      }
    }
  }
};
</script>

<style>
.nav-container {
  display: flex;
}

.nav-header {
  display: flex;
}

.nav-items {
  display: flex;
  flex-direction: column; /* 竖直排列 */
  position: relative; /* 相对定位以支持绝对定位的子元素 */
  font-size: 1em;
  width: 240px; /* 设置导航栏的宽度 */
}

.nav-item {
  width: 100%; /* 设置卡片的固定宽度 */
  padding: 20px;
  margin: -5px 0; /* 上下间距 */
  border-radius: 8px;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative; /* 使其能在相对父元素中移动 */
  height: 120px; /* 动态高度 */

}

.nav-item.active {
  transform: scale(1.1); /* 增大当前活动板块 */
  z-index: 1; /* 确保活动卡片在上方 */
}

.active-title {
  font-size: 1.5em; /* 增大字体大小 */
}

.nav-description {
  margin-left: 20px; /* 描述区域与卡片的间距 */
}

.footer {
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f0f0;
}
</style>
