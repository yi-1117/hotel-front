<template>
  <div>
    <h1>會員中心</h1>
    <p v-if="isLoggedIn">歡迎回來，會員編號：{{ memberId }}</p>
    <p v-else>請稍候，正在驗證登入狀態...</p>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const router = useRouter();
const isLoggedIn = ref(false);

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const memberId = urlParams.get("member-id");

  if (memberId) {
    sessionStorage.setItem("member-id", memberId);
    isLoggedIn.value = true;
    router.replace(`/profile/${memberId}`);
  } else {
    router.replace("/member-center/login");
  }
});
</script>
