<template>
  <div id="app">
    <Navbar v-if="!$route.meta.hideNavbar" />
    <router-view></router-view>
    <!-- 顯示不同頁面的內容 -->
    <Footer v-if="!$route.meta.hideFooter"></Footer>
  </div>
</template>

<script>
import { onMounted } from "vue";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/home/Footer.vue";
import { useAuthStore } from "@/stores/auth";

export default {
  name: "App",
  components: {
    Navbar,
    Footer,
  },
  setup() {
    const authStore = useAuthStore(); // 使用 Pinia Store

    onMounted(() => {
      authStore.initializeAuth(); // 初始化登入狀態
    });
  },
};
</script>
