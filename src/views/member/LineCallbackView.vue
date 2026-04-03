<template>
  <div>
    <h1>會員中心</h1>
    <p v-if="isLoggedIn">歡迎回來，會員編號：{{ memberId }}</p>
    <p v-else>請稍候，正在驗證登入狀態...</p>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const memberId = urlParams.get("member-id");
  const accessToken = urlParams.get("access-token");

  if (memberId && accessToken) {
    // 存入 sessionStorage
    sessionStorage.setItem("member-id", memberId);
    sessionStorage.setItem("access-token", accessToken);
    isLoggedIn.value = true;
    // 跳轉到會員中心
    router.replace (`/profile/${memberId}`);
  } else {
    // 若無法獲取資訊，回到登入頁
    router.replace("member-center/login");
  }
});
</script>
