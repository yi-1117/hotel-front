import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: function (id) {
          if (id.includes('node_modules')) {
            //分割JavaScript檔的程式邏輯
            return id.toString().split('node_modules/')[1].split('/')[0];
          }
        }
      }
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "API_BASE_URL", // 後端 API 地址
        changeOrigin: true, // 改變來源
        secure: false, // 如果後端是使用 http 協議，設置為 false
        rewrite: (path) => path.replace(/^\/api/, ""), // 替換掉 /api 前綴，根據後端路由進行調整
        ws: true  // 開啟 WebSocket 支援（如果有使用 WebSocket）
      },
    },
  },
});
