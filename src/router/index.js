import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import login from "@/views/login.vue"
import test1 from "@/views/testXueli.vue"
import china from "@/views/ChinaView.vue"
import about from "@/views/AboutView.vue"
import province from "@/views/ProvinceView.vue"
import salaryEXP from "@/views/SalaryLevel.vue"
import salaryQua from "@/views/salary.vue"
import hover from "@/views/testHover.vue"
import sectionNature from "@/views/SectionAndNature.vue"
import lay1 from "@/views/testLay.vue"
import match from "@/views/match.vue"
import education from "@/views/education.vue"
import DetailEdu from "@/components/DetailEdu.vue"
import DetailExp from "@/components/DetailExp.vue"
import DetailCompany from "@/components/DetailCompany.vue"
import profession from "@/views/profession.vue";
import trend from "@/views/trend/trend.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/skill',
      name: 'skill',
      component: () => import('../views/skill.vue')
    },
    {
      path: '/ability',
      name: 'ability',
      component: () => import('../views/ability.vue')
    },
    {
      path: '/DetailSkill',
      name: 'DetailSkill',
      component: () => import('@/components/DetailSkill.vue'),
      props: (route) => ({ field: route.query.field }) // 传递参数为 props
    },
    {
      path: '/company',
      name: 'company',
      component: () => import('../views/company.vue')
    },
    {
      path: '/home',
      component: Home,
    },
    {
      path: '/about1',
      name: 'test1', // 可以为路由命名以便于编程式导航
      component: test1
    },
    {
      path: '/china',
      name: 'china',
      component: china
    },
    {
      path: '/china/:provinceName',
      name: `province`,
      component: province,
      props:true,
    },
    {
      path: '/salary/qualification',
      name: 'salaryQua',
      component: salaryQua
    },
    {
      path: '/salary/experience',
      name: 'salaryEXP',
      component: salaryEXP
    },
    // {
    //   path: '/sectionNature',
    //   name: 'sectionNature',
    //   component: sectionNature
    // },
    {
      path: '/lay',
      name: 'lay',
      component: lay1
    },
    {
      path: '/match',
      name: 'match',
      component:match
    },
    {
      path: '/education',
      name: 'education',
      component:education
    },
    {
      path: '/DetailEdu',
      name: 'DetailEdu',
      component:DetailEdu
    },
    {
      path: '/DetailExp',
      name: 'DetailExp',
      component:DetailExp
    },
    {
      path: '/DetailCompany',
      name: 'DetailCompany',
      component:DetailCompany
    },
    {
      path: '/profession',
      name: 'profession',
      component:profession
    },
    {
      path: '/trend',
      name: 'trend',
      component:trend
    },
    // {
    //   path: '/hover',
    //   name: 'hover',
    //   component: hover
    // },
  ]
})

export default router