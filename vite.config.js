import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: 'localhost', // 将这里替换为你的局域网 IP 地址
    port: 3000,             // 将端口改为你想要的端口号，例如 3000
    open: true,             // 启动时自动打开浏览器（可选）
    // https: false,        // 如果需要使用 HTTPS，可以将其设置为 true
    // 其他服务器配置选项（可选）
  }
})
