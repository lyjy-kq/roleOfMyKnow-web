<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref,reactive} from 'vue'

import {ElMessage} from "element-plus";
import router from "@/router/index.js";
import {userRegisterService} from "@/api/login.js";
import {userLoginService} from "@/api/login.js";
import {useTokenStore} from "@/stores/token.js";
const useToken=useTokenStore()
//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)
const showForm = ref(false)


const loginData=ref({
  username:"",
  password:""
})
const registerData=ref({
  username:"",
  password:"",
  // rePassword:""
})

const register=async () => {

  //注册逻辑
  console.log(registerData.value)
  let result=await userRegisterService(registerData.value);
  if(result.data.code===200){
    ElMessage({
      message:result.message?result.message:"注册成功",
      type:"success",
      plain:true
    })
  }else{
    ElMessage({
      message:result.message?result.message:"注册失败",
      type:"error",
      plain:true
    })

  }
}
const login=async ()=>{
 //登录逻辑
  let result=await userLoginService(loginData.value);
  if(result.data.code===200){
    ElMessage({
      message:result.message?result.message:"登录成功",
      type:"success",
      plain:true
    })
    useToken.setToken(result.data)
    await router.push('/china')
  }else{
    ElMessage({
      message:result.message?result.message:"用户名和密码不匹配",
      type:"error",
      plain:true
    })

  }
}
const handleImageClick = () => {
  // 先让图片移动到左侧
  if(!showForm.value) {
    const imageElement = document.querySelector('.bg');
    imageElement.style.transition = 'all 0.5s ease';
    imageElement.style.transform = 'translateX(0%)';

    // 在动画结束后显示表单
    imageElement.addEventListener('transitionend', () => {
      showForm.value = true;
      imageElement.classList.remove('hover');
    }, {once: true});
  }else{
    const imageElement = document.querySelector('.bg');
    imageElement.style.transition = 'all 0.5s ease';
    imageElement.style.transform = 'translateX(50%)';
    showForm.value=false;
  }
}
// const checkPwd=(rule,value,callback)=>{
//   if(value===''){
//     callback(new Error("请再次输入密码"))
//   }
//   if(value!==registerData.value.password){
//     callback(new Error("两次密码输入不一致"))
//   }
// }
const rules={
  username:[
    {required:"ture",message:"请输入用户名",trigger:'blur'},
    {min:5,max:16,message: "用户名长度为5至16字符",trigger: 'blur'}
  ],
  password:[
    {required:"true",message:"请输入密码",trigger:'blur'},
    {min:5,max:16,message: "密码长度为5至16字符",trigger: 'blur'}
  ],
  // rePassword:[
  //   {validator:checkPwd,trigger:'blur'}
  // ]
}
const loginRules={
  username:[
    {required:"ture",message:"请输入用户名",trigger:'blur'},
    {min:5,max:16,message: "用户名长度为5至16字符",trigger: 'blur'}
  ],
  password:[
    {required:"true",message:"请输入密码",trigger:'blur'},
    {min:5,max:16,message: "密码长度为5至16字符",trigger: 'blur'}
  ]
}

</script>

<template class="dark">
  <el-row class="login-page">
    <el-col :span="12" class="bg"  @click="handleImageClick"></el-col>
    <el-col :span="6" :offset="3" v-if="showForm" class="form">
      <!-- 注册表单 -->
<el-card style="width: 480px" shadow="always">
      <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
        <el-form-item>

          <el-text tag="b"  size="large">请注册您的个人账号</el-text>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
        </el-form-item>
<!--        <el-form-item prop="rePassword">-->
<!--          <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="registerData.rePassword"></el-input>-->
<!--        </el-form-item>-->
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="register">
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="primary" :underline="false" @click="isRegister = false" >
            ← 返回登录
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录表单 -->
      <el-form ref="form" size="large" autocomplete="off" :model="loginData" :rules="loginRules" v-else >
        <el-form-item>
          <el-text tag="b"  size="large">欢迎使用“你职我知”！</el-text>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="loginData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="loginData.password"></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="primary" :underline="false" @click="isRegister = true" size="large">
            前往注册 →
          </el-link>
        </el-form-item>
      </el-form>
</el-card>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
  height: 100vh;
  background: url('@/assets/img.png') no-repeat center center;
  background-size: cover;
  background-color: whitesmoke;

  .bg {
    background: url('@/assets/TrueLogo.png') no-repeat center center / 70% auto;
    background-size: 70% auto;
    background-position: center center;
    background-repeat: no-repeat;
    border-radius: 0 20px 20px 0;
    transition: all 0.5s ease;
    cursor: pointer;
    transform: translateX(50%);  /* 初始位置：水平居中 */
    &:hover {
      transform: translateX(40%) scale(1.05);
    }
  }


  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    transition: opacity 0.5s ease;
    opacity: 0;
    animation: fadeIn 0.5s forwards;
    .title {
      margin: 0 auto;
    }
    .el-link {
      font-size: 16px; /* 修改字体大小 */
    }
    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }


}

</style>