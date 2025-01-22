// 导入axios 和 element-plus的相关组件
import axios from 'axios';
import { useTokenStore } from "@/stores/token.js";
import { ElMessage, ElLoading } from "element-plus"; // 导入ElLoading
import router from "@/router/index.js";

const baseURL = "http://localhost:8080";
const instance = axios.create({ baseURL });

// 定义加载指示器
let loadingInstance = null;

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        const token = useTokenStore();
        if (token.token) {
            config.headers.Authorization = token.token;
        }

        // 显示加载指示器
        loadingInstance = ElLoading.service({
            fullscreen: true,
            text: '正在加载...',
            background: 'rgba(0, 0, 0, 0.7)' // 背景色可以根据需求调整
        });

        return config;
    },
    (err) => {
        // 如果请求错误，关闭加载指示器
        if (loadingInstance) loadingInstance.close();
        return Promise.reject(err);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        // 响应成功时，关闭加载指示器
        if (loadingInstance) loadingInstance.close();
        return response;
    },
    (error) => {
        // 响应错误时，关闭加载指示器并处理错误
        if (loadingInstance) loadingInstance.close();

        // 错误提示
        ElMessage.error('请求失败，请稍后重试');
        return Promise.reject(error);
    }
);

export default instance;
