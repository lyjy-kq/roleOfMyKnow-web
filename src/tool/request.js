//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
import {useTokenStore} from "@/stores/token.js";
import {ElMessage} from "element-plus";
import router from "@/router/index.js";
//定义一个变量,记录公共的前缀  ,  baseURL
// const baseURL = "http://192.168.11.91:8080";
//const baseURL = "http://192.168.137.1:8080";
//     const baseURL = "http://192.168.137.1:8080";
//     const baseURL = "http://120.55.84.14:8080";
const baseURL = "http://localhost:8080";
const instance = axios.create({baseURL})

//请求拦截
instance.interceptors.request.use(
    (config)=>{
        const token=useTokenStore()
        if(token.token){
            config.headers.Authorization=token.token;
        }
        return config;
    },
    (err)=>{
        Promise.reject(err)
    }
)
//添加响应拦截器
// instance.interceptors.response.use(
//     result=>{
//         return result.data;
//     },
//     err=>{
//         if(err.response.status===401)
//             ElMessage({
//                 message:"请登录后获取完整服务",
//                 type:"error",
//                 plain:true,
//                 duration:2000
//             })
//         router.push("/")
//         return Promise.reject(err);//异步的状态转化成失败的状态
//     }
// )

export default instance;